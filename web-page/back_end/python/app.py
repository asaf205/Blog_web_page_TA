from flask import Flask, request, abort, make_response, render_template, redirect
import mysql.connector as mysql
import json
import uuid
import bcrypt
from password import password

db = mysql.connect(
    host="localhost",
    user="root",
    passwd=password,
    database="blog",
    buffered=True)

app = Flask(__name__, static_folder='../../build', static_url_path='/')


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    query = "select user_id,user_name, password from users where user_name = %s"
    values = (data['user'],)
    cursor = db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    if not record:
        abort(401)
    user_id = record[0]
    hashed_pwd = record[2].encode('utf-8')
    if bcrypt.hashpw(data['pass'].encode('utf-8'), hashed_pwd) != hashed_pwd:
        abort(401)

    session_id = str(uuid.uuid4())

    query = "insert into sessions (user_id, session_id) values (%s, %s) on duplicate key update session_id=%s"
    values = (user_id, session_id, session_id)
    cursor.execute(query, values)
    db.commit()
    cursor.close()
    resp = make_response()
    print(session_id)
    resp.set_cookie("session_id", session_id)
    return resp


@app.route('/api/logout', methods=['POST', 'GET'])
def logout():
    resp = make_response()
    cursor = db.cursor()
    session_id = request.cookies.get('session_id')
    resp.set_cookie('session_id', '', expires=0)
    query = "delete from sessions  where session_id=%s"
    values = (str(session_id),)
    cursor.execute(query, values)
    db.commit()
    cursor.close()
    return resp


@app.route('/api/signup', methods=['POST', 'GET'])
def signup():
    data = request.get_json()
    cursor = db.cursor()
    password = bcrypt.hashpw(data['pass'].encode('utf-8'), bcrypt.gensalt())
    query = "insert into users (user_name,password) values(%s,%s)"
    values = (data['user'], password,)
    cursor.execute(query, values)
    db.commit()
    cursor.close()
    return ""


@app.route('/api/posts', methods=['GET','POST'])
def get_all_posts():
    data = request.get_json()
    print(data)
    cursor = db.cursor()
    if data['category'] == "All":
        query = "select posts.post_id, title, body, upload_time, user_name,category from posts join users where posts.author_id = users.user_id  "
        cursor.execute(query)
    else:
        query = "select posts.post_id, title, body, upload_time, user_name,category from posts join users where posts.author_id = users.user_id and category = %s"
        values = (data['category'],)
        cursor.execute(query, values)
    # cursor = db.cursor()
    # cursor.execute(query)
    records = cursor.fetchall()
    cursor.close()
    header = ['post_id', 'title', 'body', 'upload_time', "author", "category"]
    data = []
    for r in records:
        post_id, title, body, upload_time, author, category = r
        upload_time = upload_time.strftime("%m/%d/%Y, %H:%M")
        new_tuple = (post_id, title, body, upload_time, author, category)
        data.append(dict(zip(header, new_tuple)))

    return json.dumps(data)


@app.route('/api/posts/single', methods=['GET', 'POST'])
def get_single_posts():
    data = request.get_json()
    print(data)
    curr_id = data["post_id"]
    query = "select posts.post_id, title, body, upload_time, user_name,category from posts join users where posts.author_id = users.user_id  and posts.post_id = %s"
    values = (curr_id,)
    cursor = db.cursor()
    cursor.execute(query, values)
    records = cursor.fetchall()
    cursor.close()
    header = ['post_id', 'title', 'body', 'upload_time', "author", "category"]
    data = []
    post_id, title, body, upload_time, author, category = records[0]
    upload_time = upload_time.strftime("%m/%d/%Y, %H:%M")
    new_tuple = (post_id, title, body, upload_time, author, category)
    data.append(dict(zip(header, new_tuple)))
    views_update(curr_id)
    return json.dumps(data)


@app.route('/api/add_new_comment', methods=['POST'])
def add_new_comment():
    data = request.get_json()
    print(data)
    cursor = db.cursor()
    query = "insert into comments (post_id,comment,name_of) values(%s,%s,%s)"
    values = (data['post_id'], data['comment'], data['name'])
    cursor.execute(query, values)
    db.commit()
    cursor.close()
    return ""


@app.route('/api/comments', methods=['GET'])
def get_all_comments():
    cursor = db.cursor()
    query = "select comment_id,comment,name_of,post_id from comments"
    cursor.execute(query)
    comments = cursor.fetchall()
    db.commit()
    cursor.close()
    header = ['comment_id', 'comment', 'name', "post_id"]
    comments_list = []
    for r in comments:
        comment_id, comment, name, post_id = r
        new_tuple = (comment_id, comment, name, post_id)
        comments_list.append(dict(zip(header, new_tuple)))
    print(comments_list)
    return json.dumps(comments_list)


@app.route('/api/newPost', methods=['POST'])
def add_new_post():
    data = request.get_json()
    print(data)
    cursor = db.cursor()
    query = "insert into posts (title,body,category,likes,author_id) values(%s,%s,%s,%s,%s)"
    values = (data['title'], data['body'], data['category'], 0, data['author_id'])
    cursor.execute(query, values)
    db.commit()
    cursor.close()
    return ""


@app.route('/api/check/login', methods=['POST', 'GET'])
def check_login():
    data = request.get_json()
    print(data)
    cursor = db.cursor()
    query = "select session_id,user_id from sessions where session_id = %s"
    values = (data['session_id'],)
    cursor.execute(query, values)
    record = cursor.fetchall()
    print(record)
    if not record:
        abort(401)
    header = ['session_id', 'user_id']
    session_id, user_id = record[0]
    return dict(zip(header, (session_id, user_id)))


@app.route('/api/check/edit_and_delete_permissions', methods=['POST'])
def check_edit_and_delete_permissions():
    data = request.get_json()
    print(data)
    cursor = db.cursor()
    query = "select session_id,user_id from sessions where session_id = %s"
    values = (data['session_id'],)
    cursor.execute(query, values)
    record = cursor.fetchall()
    if not record:
        abort(401)
    query2 = "select user_id from users join posts on users.user_id = posts.author_id where author_id = %s and post_id =%s"
    values2 = (record[0][1], data['post_id'])
    cursor.execute(query2, values2)
    record2 = cursor.fetchone()
    if not record2:
        abort(401)
    db.commit()
    cursor.close()
    return ""


@app.route('/api/edit', methods=['POST'])
def edit():
    data = request.get_json()
    print(data)
    cursor = db.cursor()
    query = "update posts set title = %s,body=%s,category=%s where post_id =%s"
    values = (data['title'], data['body'], data['category'], int(data['post_id']))
    cursor.execute(query, values)
    db.commit()
    cursor.close()
    return ""


@app.route('/api/delete', methods=['POST'])
def delete():
    data = request.get_json()
    print(data)
    cursor = db.cursor()
    query = "delete from comments where post_id =%s;"
    values = (int(data['post_id']),)
    cursor.execute(query, values)
    db.commit()
    cursor.close()
    cursor = db.cursor()
    query = "delete from posts where post_id =%s;"
    values = (int(data['post_id']),)
    cursor.execute(query, values)
    db.commit()
    cursor.close()
    return ""


def get_post_views(post_id):
    query = "select views from posts where post_id = %s"
    values = (post_id,)
    cursor = db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    cursor.close()
    print(record)
    return record[0]


def views_update(post_id):
    new_count = get_post_views(post_id) + 1
    query = "UPDATE posts set views = %s where post_id = %s"
    values = (new_count, post_id)
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    cursor.close()
    return f"updated the post #{post_id}, views count - {new_count}"


@app.route('/api/posts/most_popular', methods=['GET'])
def get_most_popular():
    query = "SELECT post_id, title, body, category FROM posts ORDER BY views DESC LIMIT 5;"
    cursor = db.cursor()
    cursor.execute(query)
    records = cursor.fetchall()
    cursor.close()
    header = ['post_id', 'title', 'body', 'category']
    data = []
    for r in records:
        data.append(dict(zip(header, r)))
    print(json.dumps(data))
    return json.dumps(data)


if __name__ == "__main__":
    app.run()
