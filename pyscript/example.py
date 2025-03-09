@service
def hello_world(date, number, water, money):
    """hello_world example using pyscript."""
    log.info(f"hello world: got action {date} id {number} {water} {money}")
    import os
    log.info(os.getcwd())
    import sqlite3
    conn = sqlite3.connect('my_home.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO water_record_32_1504 (抄表日期, 水表读数, 用水量, 用水费用) VALUES (?, ?, ?, ?)", ('%s' % date, number, water, money))
    conn.commit()
    conn.close()
