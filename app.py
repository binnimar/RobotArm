from flask import Flask, render_template, json, request, session, redirect, jsonify
from flask.ext.mysql import MySQL
from werkzeug import generate_password_hash, check_password_hash

app = Flask(__name__)
mysql = MySQL()
 
# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'admin4hqzqV5'
app.config['MYSQL_DATABASE_PASSWORD'] = 'GPIxJzp_II6q'
app.config['MYSQL_DATABASE_DB'] = 'robotarm'
app.config['MYSQL_DATABASE_HOST'] = '127.2.19.2'
mysql.init_app(app)

@app.route('/')
def main():
    return render_template('index.html')

@app.route('/showHome')
def showHome():
    return render_template('index.html')

@app.route('/showSignUp')
def showSignUp():
    return render_template('signup.html')

@app.route('/signUp',methods=['POST','GET'])
def signUp():
    try:
        _name = request.form['inputName']
        _email = request.form['inputEmail']
        _password = request.form['inputPassword']

        # validate the received values
        if _name and _email and _password:
            
            # All Good, let's call MySQL
            conn = mysql.connect()
            cursor = conn.cursor()
            _hashed_password = generate_password_hash(_password)
            cursor.callproc('sp_createUser',(_name,_email,_hashed_password))
            data = cursor.fetchall()

            if len(data) is 0:
                conn.commit()
                return render_template('signin.html')
                # return json.dumps({'message':'User created successfully !'})
            else:
                return json.dumps({'error':str(data[0])})
        else:
            return json.dumps({'html':'<span>Enter the required fields</span>'})

    except Exception as e:
        return json.dumps({'error':str(e)})
    finally:
        cursor.close() 
        conn.close()

@app.route('/showSignIn')
def showSignin():
    return render_template('signin.html')

@app.route('/validateLogin',methods=['POST'])
def validateLogin():
    try:
        _username = request.form['inputEmail']
        _password = request.form['inputPassword']
 
        con = mysql.connect()
        cursor = con.cursor()
        cursor.callproc('sp_validateLogin',(_username,))
        data = cursor.fetchall()
 
        if len(data) > 0:
            if check_password_hash(str(data[0][3]),_password):
                session['user'] = data[0][0]
                return redirect('/showGUI')
            else:
                return render_template('error.html',error = 'Wrong Email address or Password.')
        else:
            return render_template('error.html',error = 'Wrong Email address or Password.')
 
 
    except Exception as e:
        return render_template('error.html',error = str(e))
    finally:
        cursor.close()
        con.close()

@app.route('/showGUI')
def showGUI():
    if session.get('user'):
        con = mysql.connect()
        cursor = con.cursor()

        _user_id = session.get('user')
        _level_id = request.args.get('level')
        if _level_id is None :
            _level_id = "1"
        cursor.callproc('sp_loadLevel',_level_id)
        level = cursor.fetchall()

        result = []
        for row in level:
            result.append(0)
            result.append(row[0])
            result.append(row[1])
            result.append(row[2])
            result.append(row[3])
            result.append(row[4])
            result.append(row[5])
   
        con2 = mysql.connect()
        cursor2 = con2.cursor()
        cursor2.callproc('sp_getBestScore',(_user_id,_level_id))
        bestScore = cursor2.fetchall()[0][0]

        if bestScore is None :
            bestScore = 0
        result.append(bestScore)
            # print result
        return render_template('gui.html', data=result)
    else:
        return render_template('error.html',error = 'Unauthorized Access')

@app.route('/loadLevel',methods=['GET','POST'])
def loadLevel():
    try:
        if session.get('user'):
            _user_id = session.get('user')
            _level_id = request.form['levelID']

            con = mysql.connect()
            cursor = con.cursor()
            cursor.callproc('sp_loadLevel',(_level_id))
            level = cursor.fetchall()

            result = []
            for row in level:
                result.append(0)
                result.append(row[0])
                result.append(row[1])
                result.append(row[2])
                result.append(row[3])
                result.append(row[4])
                result.append(row[5])

                con2 = mysql.connect()
                cursor2 = con2.cursor()
                cursor2.callproc('sp_getBestScore',(_user_id,_level_id))
                bestScore = cursor2.fetchall()[0][0]
                if bestScore is None :
                    bestScore = 0
                result.append(bestScore)
                # return render_template('gui.html', data=map(json.dumps, result))
            return render_template('gui.html', data=result)

        else:
            return render_template('error.html', error = 'Unauthorized Access')
    except Exception as e:
        return render_template('error.html', error = str(e))

@app.route('/addSolution',methods=['POST'])
def addSolution():
    try:
        if session.get('user'):
            _operation_list = request.form['userSolution']
            _blocks_end_state = request.form['finalBlockPositions']
            _level_id = request.form['solutionLevelID']
            _user_id = session.get('user')
            _user_score = request.form['userScore']

            conn = mysql.connect()
            cursor = conn.cursor()
            cursor.callproc('sp_addSolution',(_operation_list,_blocks_end_state,_level_id,_user_id,_user_score))
            data = cursor.fetchall()

            if(_blocks_end_state == "incorrect"):
                print "WRONG!"
                return redirect('/showGUI?level=' + str(_level_id))
            elif len(data) is 0:
                conn.commit()
                newLevel = int(_level_id) + 1
                if newLevel > 2 :
                    return redirect('/showGUI')
                else :
                    return redirect('/showGUI?level=' + str(newLevel))
            else:
                return render_template('error.html',error = 'An error occurred!')
 
        else:
            return render_template('error.html',error = 'Unauthorized Access')
    except Exception as e:
        return render_template('error.html',error = str(e))
    finally:
        cursor.close()
        conn.close()

@app.route('/showSolutions')
def showSolutions():
    if session.get('user'):
        return render_template('showSolutions.html')
    else:
        return render_template('error.html',error = 'Unauthorized Access')       

@app.route('/loadSolutions')
def loadSolutions():
    if session.get('user'):
        _user = session.get('user')

        con = mysql.connect()
        cursor = con.cursor()
        cursor.callproc('sp_getUserSolutions',(_user,))
        solutions = cursor.fetchall()

        result = []
        for solution in solutions:
            solution_dict = {
                'id': solution[0],
                'operation_list': solution[1],
                'blocks_end_state': solution[2],
                'level_id': solution[3]}
            result.append(solution_dict)

        return json.dumps(result)

        # print result

        # return render_template('showSolutions.html')
    else:
        return render_template('error.html',error = 'Unauthorized Access')

@app.route('/loadSolution',methods=['GET','POST'])
def loadSolution():
    try:
        if session.get('user'):
            _user = session.get('user')
            _solution_id = request.form['solutionID']
            _level_id = request.form['levelID']

            con = mysql.connect()
            cursor = con.cursor()
            cursor.callproc('sp_getSolution',(_user,_solution_id))
            solution = cursor.fetchall()

            result = []
            for row in solution:
                    result.append(1)
                    result.append(row[0])
                    result.append(row[1])
                    result.append(row[2])
                    result.append(row[3])

            con2 = mysql.connect()
            cursor2 = con2.cursor()
            cursor2.callproc('sp_loadLevel',(_level_id))
            level = cursor2.fetchall()

            for row in level:
                result.append(row[0])
                result.append(row[1])
                result.append(row[2])
                result.append(row[3])
                result.append(row[4])
                result.append(row[5])

                con3 = mysql.connect()
                cursor3 = con3.cursor()
                cursor3.callproc('sp_getBestScore',(_user,_level_id))
                bestScore = cursor3.fetchall()[0][0]
                if bestScore is None :
                    bestScore = 0
                result.append(bestScore)

            # print solution
            return render_template('gui.html', data=result)

            print solution
            return render_template('gui.html', data=result)
        else:
            return render_template('error.html', error = 'Unauthorized Access')
    except Exception as e:
        return render_template('error.html', error = str(e))

@app.route('/showTutorial3')
def showTutorial3():
    if session.get('user'):
        return render_template('tutorial3.html')
    else:
        return render_template('error.html',error = 'Unauthorized Access')

@app.route('/showTutorial2')
def showTutorial2():
    if session.get('user'):
        return render_template('tutorial2.html')
    else:
        return render_template('error.html',error = 'Unauthorized Access')

@app.route('/showTutorial1')
def showTutorial1():
    if session.get('user'):
        return render_template('tutorial1.html')
    else:
        return render_template('error.html',error = 'Unauthorized Access')

@app.route('/showTutorial0')
def showTutorial0():
    if session.get('user'):
        return render_template('tutorial0.html')
    else:
        return render_template('error.html',error = 'Unauthorized Access')

@app.route('/logout')
def logout():
    session.pop('user',None)
    return redirect('/')


if __name__ == "__main__":
    app.secret_key = 'super secret key'
    app.debug = True
    app.run()
