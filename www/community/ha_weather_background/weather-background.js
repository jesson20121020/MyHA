// ios-weather-background-dashboard.js
const DEBUG_PREFIX = "iOS Weather Background DEBUG: ";
const LOG_PREFIX = "iOS Weather Background: ";

// 全局变量
let Root;
let Hui;
let Lovelace;
let Weather_Config;
let Haobj = null;
let View;
let Debug_Mode = false;
let Loaded = false;
let View_Loaded = false;
let Current_Condition = null;
let Weather_Entity = 'weather.home';
let Weather_Container = null;
let Animation_Frame = null;
let Last_Update_Time = 0;
let Current_Dashboard = null;

// 事件监听器引用
let PopStateListener = null;
let HashChangeListener = null;
let MutationObserverInstance = null;

// iOS风格天气背景色配置
const iOS_Weather_Colors = {
  sunny: {
    day: ['#47ABF1', '#8DC8E8'], // 晴天白天
    night: ['#0D2B4E', '#1C3B5E'] // 晴天夜晚
  },
  rainy: {
    day: ['#57575D', '#6E6E74'], // 雨天白天
    night: ['#2C2C32', '#3C3C42'] // 雨天夜晚
  },
  cloudy: {
    day: ['#54717A', '#7F95A3'], // 多云白天
    night: ['#2C3E50', '#3C4E60'] // 多云夜晚
  },
  snowy: {
    day: ['#4C73A1', '#7B9BB9'], // 雪天白天
    night: ['#2C3E50', '#3C4E60'] // 雪天夜晚
  },
  foggy: {
    day: ['#5C5C5C', '#929292'], // 雾天白天
    night: ['#3C3C42', '#5C5C62'] // 雾天夜晚
  },
  default: {
    day: ['#47ABF1', '#8DC8E8'], // 默认白天
    night: ['#0D2B4E', '#1C3B5E'] // 默认夜晚
  }
};

// 不同天气的粒子配置
const iOS_Particle_Config = {
  sunny: { count: 1, updateInterval: 1000 },
  rainy: { count: 80, updateInterval: 50 },
  cloudy: { count: 6, updateInterval: 200 },
  snowy: { count: 100, updateInterval: 50 },
  foggy: { count: 8, updateInterval: 200 }
};

// 粒子池
let Particle_Pool = [];
let Active_Particles = [];

// 工具函数
function STATUS_MESSAGE(message, force) {
  if (!Debug_Mode) {
    console.log(LOG_PREFIX + message);
  } else if (force) {
    console.log(DEBUG_PREFIX + message);
  }
}

function DEBUG_MESSAGE(message, object) {
  if (Debug_Mode) {
    console.log(DEBUG_PREFIX + message);
    if (object) {
      console.log(object);
    }
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// 获取当前时间是否为夜晚 (6pm - 6am)
function isNightTime() {
  const hour = new Date().getHours();
  return hour < 6 || hour >= 18;
}

// 获取iOS风格背景渐变
function getiOSBackgroundGradient(weatherType) {
  const isNight = isNightTime();
  const colors = iOS_Weather_Colors[weatherType] || iOS_Weather_Colors.default;
  const gradientColors = isNight ? colors.night : colors.day;
  
  return `linear-gradient(to bottom, ${gradientColors[0]}, ${gradientColors[1]})`;
}

// 获取当前仪表盘信息
function getCurrentDashboard() {
  try {
    // 从URL获取仪表盘ID
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length > 1){
      return pathParts[1];
    }
    
    // 从Lovelace对象获取当前仪表盘
    if (Lovelace && Lovelace.urlPath) {
      return Lovelace.urlPath;
    }
    
    // 默认仪表盘
    return '0';
  } catch (e) {
    DEBUG_MESSAGE("Error getting current dashboard: " + e.message);
    return '0';
  }
}

// 检查是否对当前仪表盘生效
function isEnabledForCurrentDashboard() {
  if (!Weather_Config) {
    // 如果没有配置Weather_Config, 则不生效
    return false;
  }
  
  const currentDashboard = getCurrentDashboard();
  DEBUG_MESSAGE("Current dashboard: " + currentDashboard);
  if (!Lovelace || Lovelace.urlPath != currentDashboard){
    return false;
  }
  
  // 默认对所有仪表盘生效
  return true;
}

// 获取DOM元素
function getVars() {
  try {
    Root = document.querySelector("home-assistant");
    if (!Root) return false;
    
    Root = Root.shadowRoot;
    Root = Root.querySelector("home-assistant-main");
    Root = Root && Root.shadowRoot;
    Root = Root && Root.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver");
    
    Root = (Root && Root.shadowRoot) || Root;
    Root = Root && Root.querySelector("ha-panel-lovelace");
    
    if (Root) {
      Root = Root.shadowRoot;
    }
    
    Root = Root && Root.querySelector("hui-root");
    Hui = Root;

    if (Root) {
      Lovelace = Root.lovelace;
      if (Lovelace && Lovelace.config) {
        Weather_Config = Lovelace.config.weather_background;
        if (Weather_Config) {
          Weather_Entity = Weather_Config.weather_entity || 'weather.home';
          Debug_Mode = Weather_Config.debug_mode || false;
        }
      }
      View = Root.shadowRoot.getElementById("view");
    }
    return true;
  } catch (e) {
    DEBUG_MESSAGE("Error getting vars: " + e.message);
    return false;
  }
}

// 创建天气背景容器
function createWeatherContainer() {
  // 移除现有容器
  if (Weather_Container) {
    Weather_Container.remove();
    Weather_Container = null;
  }
  
  // 检查是否对当前仪表盘生效
  if (!isEnabledForCurrentDashboard()) {
    DEBUG_MESSAGE("Weather background disabled for current dashboard");
    return null;
  }
  
  // 创建新容器
  Weather_Container = document.createElement('div');
  Weather_Container.id = 'ios-weather-background';
  Weather_Container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: hidden;
    transition: background 1.5s ease;
    will-change: contents;
  `;
  
  // 添加到DOM
  if (document.body) {
    document.body.appendChild(Weather_Container);
    return Weather_Container;
  }
  
  return null;
}

// 初始化粒子池
function initParticlePool() {
  // 清除现有粒子
  if (Weather_Container) {
    while (Weather_Container.firstChild) {
      Weather_Container.removeChild(Weather_Container.firstChild);
    }
  }
  
  // 确定最大粒子数
  const maxParticles = Math.max(
    iOS_Particle_Config.sunny.count,
    iOS_Particle_Config.rainy.count,
    iOS_Particle_Config.cloudy.count,
    iOS_Particle_Config.snowy.count,
    iOS_Particle_Config.foggy.count
  );
  
  // 创建粒子池
  Particle_Pool = [];
  for (let i = 0; i < maxParticles; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      pointer-events: none;
      opacity: 0;
      will-change: transform, opacity;
    `;
    
    if (Weather_Container) {
      Weather_Container.appendChild(particle);
    }
    
    Particle_Pool.push({
      element: particle,
      active: false,
      type: '',
      x: 0,
      y: 0,
      size: 0,
      speed: 0,
      angle: 0,
      opacity: 0
    });
  }
  
  Active_Particles = [];
}

// 获取天气状态
function getWeatherState() {
  if (Haobj && Haobj.states && Haobj.states[Weather_Entity]) {
    return Haobj.states[Weather_Entity].state.toLowerCase();
  }
  return null;
}

// 更新天气效果
function updateWeatherEffect(condition) {
  if (!Weather_Container) return;
  
  // 停止当前动画
  if (Animation_Frame) {
    cancelAnimationFrame(Animation_Frame);
    Animation_Frame = null;
  }
  
  // 移除所有天气类
  Weather_Container.className = 'ios-weather-background';
  
  // 添加当前天气类
  Weather_Container.classList.add(condition);
  Current_Condition = condition;
  
  // 设置iOS风格背景
  Weather_Container.style.background = getiOSBackgroundGradient(condition);
  
  // 停用所有粒子
  deactivateAllParticles();
  
  // 根据天气类型激活粒子
  const particleConfig = iOS_Particle_Config[condition] || iOS_Particle_Config.sunny;
  activateParticles(condition, particleConfig.count);
  
  // 启动动画
  Last_Update_Time = performance.now();
  animateParticles();
}

// 停用所有粒子
function deactivateAllParticles() {
  Active_Particles.forEach(particle => {
    particle.element.style.opacity = 0;
    particle.active = false;
  });
  Active_Particles = [];
}

// 激活指定数量的粒子
function activateParticles(type, count) {
  const availableParticles = Particle_Pool.filter(p => !p.active);
  const particlesToActivate = availableParticles.slice(0, count);
  
  particlesToActivate.forEach(particle => {
    particle.active = true;
    particle.type = type;
    
    const el = particle.element;
    el.className = '';
    el.classList.add('ios-weather-particle', type);
    
    // 根据粒子类型设置初始状态
    switch(type) {
      case 'sunny':
        particle.x = 20 + Math.random() * 20;
        particle.y = 10 + Math.random() * 20;
        particle.size = 80 + Math.random() * 40;
        particle.opacity = 0.9 + Math.random() * 0.1;
        
        el.style.width = `${particle.size}px`;
        el.style.height = `${particle.size}px`;
        el.style.left = `${particle.x}%`;
        el.style.top = `${particle.y}%`;
        el.style.opacity = particle.opacity;
        el.style.background = 'radial-gradient(circle, #FFD700 0%, #FFA500 70%, transparent 85%)';
        el.style.borderRadius = '50%';
        el.style.boxShadow = '0 0 80px 30px rgba(255, 215, 0, 0.6)';
        el.style.transform = 'translateZ(0)';
        break;
        
      case 'rainy':
        particle.x = Math.random() * 100;
        particle.y = -10 - Math.random() * 20;
        particle.size = 15 + Math.random() * 25;
        particle.speed = 0.7 + Math.random() * 0.8;
        particle.opacity = 0.7 + Math.random() * 0.2;
        
        el.style.width = '1.5px';
        el.style.height = `${particle.size}px`;
        el.style.left = `${particle.x}%`;
        el.style.top = `${particle.y}%`;
        el.style.opacity = particle.opacity;
        el.style.background = 'linear-gradient(to bottom, rgba(180, 200, 220, 0.9), transparent)';
        el.style.transform = 'translateZ(0)';
        break;
        
      case 'cloudy':
        particle.x = Math.random() * 100;
        particle.y = 10 + Math.random() * 60;
        particle.size = 40 + Math.random() * 60;
        particle.speed = 20 + Math.random() * 20;
        particle.opacity = 0.4 + Math.random() * 0.3;
        
        el.style.width = `${particle.size}px`;
        el.style.height = `${particle.size * 0.6}px`;
        el.style.left = `${particle.x}%`;
        el.style.top = `${particle.y}%`;
        el.style.opacity = particle.opacity;
        el.style.background = 'rgba(240, 240, 240, 0.9)';
        el.style.borderRadius = '50%';
        el.style.filter = 'blur(4px)';
        el.style.transform = 'translateZ(0)';
        break;
        
      case 'snowy':
        particle.x = Math.random() * 100;
        particle.y = -5 - Math.random() * 15;
        particle.size = 2 + Math.random() * 4;
        particle.speed = 4 + Math.random() * 8;
        particle.angle = Math.random() * Math.PI * 2;
        particle.wobble = Math.random() * 1.5;
        particle.opacity = 0.9 + Math.random() * 0.1;
        
        el.style.width = `${particle.size}px`;
        el.style.height = `${particle.size}px`;
        el.style.left = `${particle.x}%`;
        el.style.top = `${particle.y}%`;
        el.style.opacity = particle.opacity;
        el.style.background = 'rgba(255, 255, 255, 0.95)';
        el.style.borderRadius = '50%';
        el.style.filter = 'blur(0.5px)';
        el.style.transform = 'translateZ(0)';
        break;
        
      case 'foggy':
        particle.x = Math.random() * 100;
        particle.y = Math.random() * 100;
        particle.size = 60 + Math.random() * 120;
        particle.speed = 30 + Math.random() * 30;
        particle.opacity = 0.25 + Math.random() * 0.15;
        
        el.style.width = `${particle.size}px`;
        el.style.height = `${particle.size * 0.5}px`;
        el.style.left = `${particle.x}%`;
        el.style.top = `${particle.y}%`;
        el.style.opacity = particle.opacity;
        el.style.background = 'rgba(220, 220, 220, 0.4)';
        el.style.borderRadius = '50%';
        el.style.filter = 'blur(8px)';
        el.style.transform = 'translateZ(0)';
        break;
    }
    
    Active_Particles.push(particle);
  });
}

// 粒子动画
function animateParticles(timestamp) {
  if (!timestamp) timestamp = performance.now();
  
  const deltaTime = timestamp - Last_Update_Time;
  Last_Update_Time = timestamp;
  
  Active_Particles.forEach(particle => {
    const el = particle.element;
    
    switch(particle.type) {
      case 'rainy':
        particle.y += particle.speed * (deltaTime / 16);
        if (particle.y > 100) {
          particle.y = -10 - Math.random() * 20;
          particle.x = Math.random() * 100;
        }
        el.style.top = `${particle.y}%`;
        break;
        
      case 'cloudy':
        particle.x += 0.08 * (deltaTime / 16);
        if (particle.x > 120) {
          particle.x = -20;
          particle.y = 10 + Math.random() * 60;
        }
        el.style.left = `${particle.x}%`;
        break;
        
      case 'snowy':
        particle.y += particle.speed * (deltaTime / 16);
        particle.x += Math.sin(particle.angle) * 0.08 * (deltaTime / 16);
        particle.angle += particle.wobble * 0.008 * (deltaTime / 16);
        
        if (particle.y > 100) {
          particle.y = -5 - Math.random() * 15;
          particle.x = Math.random() * 100;
        }
        el.style.top = `${particle.y}%`;
        el.style.left = `${particle.x}%`;
        break;
        
      case 'foggy':
        particle.x += 0.04 * (deltaTime / 16);
        if (particle.x > 120) {
          particle.x = -20;
          particle.y = Math.random() * 100;
        }
        el.style.left = `${particle.x}%`;
        break;
    }
  });
  
  Animation_Frame = requestAnimationFrame(animateParticles);
}

// 添加CSS动画关键帧
function addAnimationStyles() {
  if (document.getElementById('ios-weather-animations')) return;
  
  const style = document.createElement('style');
  style.id = 'ios-weather-animations';
  style.textContent = `
    @keyframes iosRainFall {
      to { transform: translateY(100vh); }
    }
    
    @keyframes iosCloudMove {
      to { transform: translateX(20vw); }
    }
    
    @keyframes iosSnowFall {
      to { transform: translateY(100vh); }
    }
    
    @keyframes iosFogMove {
      to { transform: translateX(20vw); }
    }
    
    @keyframes iosSunGlow {
      0% { box-shadow: 0 0 80px 30px rgba(255, 215, 0, 0.6); }
      100% { box-shadow: 0 0 100px 40px rgba(255, 215, 0, 0.8); }
    }
  `;
  
  document.head.appendChild(style);
}

// 检查天气状态变化
function checkWeatherChange() {
  const currentState = getWeatherState();
  
  if (currentState && currentState !== Current_Condition) {
    Current_Condition = currentState;
    updateWeatherEffect(currentState);
  }
}

// 检查时间变化（白天/夜晚切换）
function checkTimeChange() {
  const wasNight = isNightTime();
  
  // 每分钟检查一次时间变化
  setTimeout(() => {
    const isNowNight = isNightTime();
    if (wasNight !== isNowNight && Current_Condition && Weather_Container) {
      // 时间变化，更新背景色
      Weather_Container.style.background = getiOSBackgroundGradient(Current_Condition);
    }
    checkTimeChange();
  }, 60000);
}

// 仪表盘变化事件处理
function handleDashboardChange() {
  const previousDashboard = Current_Dashboard;
  Current_Dashboard = getCurrentDashboard();
  
  if (previousDashboard !== Current_Dashboard) {
    DEBUG_MESSAGE("Dashboard changed from " + previousDashboard + " to " + Current_Dashboard);
    
    // 重新初始化天气背景
    cleanup();
    
    // 检查是否对新仪表盘生效
    if (isEnabledForCurrentDashboard()) {
      renderWeatherBackground();
    } else {
      DEBUG_MESSAGE("Weather background disabled for dashboard: " + Current_Dashboard);
    }
  }
}

// 设置仪表盘变化事件监听
function setupDashboardChangeListeners() {
  // 监听URL变化（popstate事件）
  if (PopStateListener) {
    window.removeEventListener('popstate', PopStateListener);
  }
  
  PopStateListener = function() {
    setTimeout(handleDashboardChange, 100); // 延迟确保URL已更新
  };
  window.addEventListener('popstate', PopStateListener);
  
  // 监听hash变化（某些情况下使用）
  if (HashChangeListener) {
    window.removeEventListener('hashchange', HashChangeListener);
  }
  
  HashChangeListener = function() {
    setTimeout(handleDashboardChange, 100);
  };
  window.addEventListener('hashchange', HashChangeListener);
  
  // 监听Home Assistant特定事件
  if (window.addEventListener) {
    // 监听可能的自定义事件
    window.addEventListener('location-changed', handleDashboardChange);
    window.addEventListener('lovelace-dashboard-changed', handleDashboardChange);
  }
  
  DEBUG_MESSAGE("Dashboard change listeners setup completed");
}

// 移除仪表盘变化事件监听
function removeDashboardChangeListeners() {
  if (PopStateListener) {
    window.removeEventListener('popstate', PopStateListener);
    PopStateListener = null;
  }
  
  if (HashChangeListener) {
    window.removeEventListener('hashchange', HashChangeListener);
    HashChangeListener = null;
  }
  
  window.removeEventListener('location-changed', handleDashboardChange);
  window.removeEventListener('lovelace-dashboard-changed', handleDashboardChange);
}

// 主渲染函数
function renderWeatherBackground() {
  if (!getVars()) {
    DEBUG_MESSAGE("Failed to get DOM elements");
    return;
  }
  
  // 检查是否对当前仪表盘生效
  if (!isEnabledForCurrentDashboard()) {
    DEBUG_MESSAGE("Weather background disabled for current dashboard");
    return;
  }
  
  // 创建背景容器
  createWeatherContainer();
  
  if (!Weather_Container) {
    DEBUG_MESSAGE("Failed to create weather container");
    return;
  }
  
  // 初始化粒子池
  initParticlePool();
  
  // 添加动画样式
  addAnimationStyles();
  
  // 初始天气状态
  const initialState = getWeatherState();
  if (initialState) {
    Current_Condition = initialState;
    updateWeatherEffect(initialState);
  } else {
    updateWeatherEffect('sunny');
  }
  
  // 启动天气状态检查
  setInterval(checkWeatherChange, 5000);
  
  // 启动时间变化检查
  checkTimeChange();
  
  Loaded = true;
  STATUS_MESSAGE("iOS Weather background initialized for dashboard: " + Current_Dashboard);
}

// 设置MutationObservers
function setupObservers() {
  if (!View) return;
  
  // 视图观察器
  const viewObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        DEBUG_MESSAGE("View changed, re-rendering weather background");
        cleanup();
        renderWeatherBackground();
      }
    });
  });
  
  viewObserver.observe(View, {
    childList: true,
    subtree: true
  });
  
  MutationObserverInstance = viewObserver;
}

// 清理资源
function cleanup() {
  if (Animation_Frame) {
    cancelAnimationFrame(Animation_Frame);
    Animation_Frame = null;
  }
  
  if (Weather_Container) {
    Weather_Container.remove();
    Weather_Container = null;
  }
  
  if (MutationObserverInstance) {
    MutationObserverInstance.disconnect();
    MutationObserverInstance = null;
  }
  
  Particle_Pool = [];
  Active_Particles = [];
  Loaded = false;
}

// 完整清理函数
function fullCleanup() {
  cleanup();
  removeDashboardChangeListeners();
}

// 主函数
function run() {
  getVars();
  STATUS_MESSAGE("Starting iOS Weather Background");
  
  // 获取当前仪表盘
  Current_Dashboard = getCurrentDashboard();
  
  if (!Loaded) {
    if (!Weather_Config) {
      STATUS_MESSAGE("No weather background configuration found");
    }
  }

  // 设置仪表盘变化监听
  setupDashboardChangeListeners();

  // 订阅hass对象以检测状态变化
  if (!Haobj) {
    document.querySelector("home-assistant").provideHass({
      set hass(value) {
        Haobj = value;
        if (!Loaded) {
          renderWeatherBackground();
          setupObservers();
        }
      }
    });
  } else {
    if (!Loaded) {
      renderWeatherBackground();
      setupObservers();
    }
  }
}

// 启动
run();

// 清理函数，在页面卸载时调用
window.addEventListener('beforeunload', function() {
  fullCleanup();
});

// 页面可见性变化时暂停/恢复动画
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    if (Animation_Frame) {
      cancelAnimationFrame(Animation_Frame);
      Animation_Frame = null;
    }
  } else if (Loaded && Current_Condition) {
    Last_Update_Time = performance.now();
    animateParticles();
  }
});