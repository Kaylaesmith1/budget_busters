from flask import Flask, render_template, request, url_for
from datetime import datetime
import sys
import os.path
import gspread
from google.oauth2.service_account import Credentials
from tabulate import tabulate
from termcolor import colored
from dotenv import load_dotenv
load_dotenv()
STATIC_DIR = '/workspace/budget_busters/assets'

# credentials for linking to google drive/ google sheets
SCOPE = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive"
    ]

CREDS = Credentials.from_service_account_file('creds.json')

CREDS = SCOPED_CREDS = CREDS.with_scopes(SCOPE)
GSPREAD_CLIENT = gspread.authorize(SCOPED_CREDS)
SHEET = GSPREAD_CLIENT.open("budget_busters")

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

TEMPLATE_DIR = os.path.abspath('templates')
STATIC_DIR = os.path.abspath('assets')


#Utility functions for messaging
def print_message(text_string):
    """
    The print_message function displays text with consistent appearance
    """
    print(colored(text_string, 'black', 'on_white'))
    return True


def print_error(text_string):
    """
    The print_error function displays text with consistent appearance
    """
    print(colored(text_string, 'black', 'on_yellow'))
    return True

def print_status(text_string):
    """
    The print_text function displays text with consistent appearance
    """
    print(colored(text_string, "white", "on_green"))
    return True


# The following are a set of utility functions for manipulating data on the google budget_buster spreadsheet tabs
def return_record(worksheet, row_num):
    """
    This is a utility function to return a specific row data from a given worksheet.
    """
    record_data = []
    if (row_num > 0):
        record_data = get_worksheet(worksheet)[row_num]
    else:
        print_error(f"Invalid {worksheet} row # {row_num}")
    return record_data


def list_worksheet(worksheet, row_num, user):
    """
    This is a utility function to print all data from a given worksheet.
    If @row>0 list heading plus specific row only
    else (@row = 0)
      if @user is "" then list all rows,
      else list heading plus only rows that are linked to this user
    """
    if (row_num > 0):
        # get first (titles) row and row that was specifically requested
        all_data = [get_worksheet(worksheet)[0],
                    get_worksheet(worksheet)[row_num]]
    else:
        all_data = get_worksheet(worksheet)
        print_cols = []
        if worksheet == "user_spend":
            all_data[0] = ["spend_id", "spend_username", "spend_cat", "spend_cat_name", "spend_amt", "spend_date", "spend_YYMM",]
            for data in all_data:
                #  if the search is for all records regardless of user, or if the username 
                #  is found in 2nd column then include this record 
                if user=="" or user==data[1]:
                    print_cols.append([data[0], data[1], data[2],
                                data[3], data[4], data[5], data[6]])
            all_data = print_cols
        elif worksheet == "user_config":
            all_data[0] = ["username", "budget", "basic_cat1", "basic_cat2","basic_cat3", 
                        "basic_cat4", "basic_cat5", "basic_cat6","basic_cat7","basic_cat8",
                        "lux_cat1", "lux_cat2", "lux_cat3","lux_cat4","lux_cat5","lux_cat6", 
                        "lux_cat7", "lux_cat8"]
                        
            for data in all_data:
                #  if the search is for all records regardless of user, or if the username 
                #  is found in 1st column then include this record 
                if user=="" or user==data[0]:
                    print_cols.append([data[0], data[1], data[2],
                                    data[3], data[4], data[5], 
                                    data[6], data[7], data[8], 
                                    data[9], data[10], data[11],
                                    data[12], data[13], data[14], 
                                    data[15], data[16], data[17]])
            all_data = print_cols
        elif worksheet == "user_goals":
            all_data[0] = ["goal_user", "goal_seq", "goal_title", 
                        "goal_start_value","goal_end_value","goal_start_month",
                        "goal_end_month","goal_achieved","goal_notes"]
            for data in all_data:
                #  if the search is for all records regardless of user, or if the username 
                #  is found in 1st column then include this record 
                if user=="" or user==data[1]:
                    print_cols.append([data[0], data[1], data[2],
                                    data[3], data[4], data[5], 
                                    data[6], data[7], data[8]])
            all_data = print_cols
    table1 = tabulate(all_data, headers='firstrow', tablefmt='fancy_grid')
    return all_data


def get_worksheet(worksheet):
    """
    This is a utility function to return all data from a given worksheet
    """
    worksheet_to_return = SHEET.worksheet(worksheet)
    all_data = worksheet_to_return.get_all_values()
    return all_data



def find_records(worksheet, username):
    """
    Allows search by username - from a named google sheet within the budget_buster database 
    Returns a dataset
    """
    row_num = find_repair_index(options)
    if (row_num == 0):
        disp_all = input(colored("List all repairs? (N for no) ",
                                 'black', 'on_white')).upper()
        if (disp_all == 'N'):
            return False
    list_worksheet("repairs", row_num, "")
    print("")
    input(colored("Press ENTER key to return to main menu....",
                  'black', 'on_white'))
    return True

def add_record(worksheet, data):
    """
    This option can be used to enter a user goal or a user spend.
    Depending on the worksheet that is passed to it.
    """
    if (worksheet=="user_goals"):
        user="fred"
#        goal_seq = next_goal_index(user)
        goal_seq = 60
        goal_title = "attend olympics"
        goal_start_value = 0
        goal_end_value = 3000
        goal_start_month = 2401
        goal_end_month = 2406
        goal_status = False
        goal_notes =""
        new_record = [next_index("user_goals"), user, goal_seq, goal_title,
                    goal_start_value, goal_end_value, goal_start_month, goal_end_month, goal_status, goal_notes]
    
    elif (worksheet == "user_spend"):
        user="fred"
        spend_cat = "basic_cat1"
        spend_cat_name = "Food"
        spend_amt = 50.00
        spend_date = datetime.now().strftime("%d/%m/%Y")
        spend_YYMM = datetime.now().strftime("%y%m")
        new_record = [next_index("user_spend"), user, spend_cat, spend_cat_name,
                    spend_amt, spend_date, 2401]
    
    else:
        print_error("Invalid worksheet")
        return False

    append_worksheet(worksheet, new_record)
    return True


def next_index(worksheet):
    """
    This function calculates the next index number in column 0 of
    user_spend or user_goals spreadsheet
    it is calculated as last index + 1
    return this value
    """
    
    all_records = SHEET.worksheet(worksheet).get_all_values()
    next_index = int(all_records[-1][0]) + 1
    print(f"worksheet {worksheet} next index is {next_index}" )
    return next_index


def append_worksheet(worksheet, data):
    """
    Update any worksheet, add new row with the data provided
    """
    print(f"In append_worksheet, about to append to worksheet {worksheet} with data {data}")
    worksheet_to_update = SHEET.worksheet(worksheet)
    print(f"worksheet to update: {worksheet_to_update}")
    worksheet_to_update.append_row(data)
    print_status(f"New {worksheet} record {data[1]} {data[0]} for"
                 + f" {data[3]} added")
    print("")
    return True




app = Flask(__name__, template_folder=TEMPLATE_DIR, static_folder=STATIC_DIR)
    # template_folder and static_folder hange the default folders for the
    # templates and static files used by the render function
print(f"TEMPLATE_DIR is", TEMPLATE_DIR)

print(f"STATIC_DIR is", STATIC_DIR)
list_worksheet("user_spend", 2, "fred")
# list_worksheet("user_config", 1) throwing index out of range error
list_worksheet("user_goals", 0, "") 

# start off by showing the 'default user' confi#g
config_data = list_worksheet("user_config", 1, "default")
# print(f'Default user config is:', config_data )


@app.route('/')
def index():
    return render_template('index_gs.html', user_config=config_data)

@app.route('/user_data/<string:username>', methods=['GET', 'POST']) 
def user_data(username): 
    # call your Python function here 
        user_goals = list_worksheet("user_goals", 0, username) 
        user_spend = list_worksheet("user_spend", 0, username)
        user_config = list_worksheet("user_config", 1, "default")
        return render_template('index_gs.html', user_goals=user_goals, user_spend=user_spend, user_config=user_config)

@app.route('/add_data/', methods=['POST']) 
def add_data(): 
    # call your Python function here 
    add_record("user_spend","")
    print(f"User spend added")
    add_record("user_goals","")
    print(f"User goals added")
    return render_template('index_gs.html')
