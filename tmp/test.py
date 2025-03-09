import sqlite3
from datetime import datetime

def parse_input():
    # 解析数据数据
    data = msg['payload'].split(' ')
    if len(data) != 4:
        node.error("输入数据格式不正确, 需要: 日期 读数 用气量 费用")
        return None
    date, value, usage, cost = data
    try:
        datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        node.error("不是有效的日志格式")
        return None
    try:
        value = int(value)
    except:
        node.error("不是有效的整数")
        return None
    try:
        usage = int(usage)
    except:
        node.error("不是有效的整数")
        return None
    try:
        cost = int(cost)
    except:
        node.error("不是有效的浮点数")
        return None
    return (date, value, usage, cost)
    

def insert_date(cursor, date):
    cursor.execute('INSERT OR REPLACE INTO gas_1504 (抄表日期, 燃气表读数, 燃气用量, 燃气费用) VALUES ("%s", %s, %s, %s);' % (date[0], date[1], date[2], date[3]))


def read_gas_data(cursor):
    # 执行查询
    cursor.execute("SELECT * FROM gas_1504")
    
    # 获取所有行
    rows = cursor.fetchall()
    
    # 提取查询结果
    records = {}
    for (date, value, usage, cost) in rows:
        records[date] = (value, usage, cost)

    
    return records

# 连接到数据库
conn = sqlite3.connect('my_home.db')
# 创建游标对象
cursor = conn.cursor()
# 插入， 更新燃气数据
input_date = parse_input()
input_date and insert_date(cursor, input_date)
records = read_gas_data()
# 关闭连接
conn.close()


# 更新燃气数据
records_date = []
records_value = []
records_usage = []
records_cost = []

# 倒序排序
for date in sorted(records.keys()):
    records_date.append(date)
    records_value.append(records[date][0])
    records_usage.append(records[date][1])
    records_cost.append(records[date][2])

msg['records_date'] = records_date
msg['records_value'] = records_value
msg['records_usage'] = records_usage
msg['records_cost'] = records_cost

msg['抄表日期'] = records_date[-1]
msg['表数'] = records_value[-1]
msg['用气量'] = records_usage[-1]
msg['金额'] = records_cost[-1]

return msg
