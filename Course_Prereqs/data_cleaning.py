import pandas as pd
import numpy as np
import math
import json

#Method 1: Getting the frequency of every word in the prerequisite category and counting it's frequencies
df = pd.read_csv('2023-2024_Courses.csv')

prereq_word_frequency = {}

#Parsing the data to get the list of all courses + all the major department acronyms

#Arrays + Dictionary Declerations
course_and_prereqs = {} #Ex: {'CS 1738': [CS 0069]}
list_of_courses = [] #Ex: CS 1738
list_of_major_acronyms = [] #ex: CS, ECE, MAT

#Parsing through the file to obtain key list of courses, major acronyms, and the keys for the course_and_prereq dictionary
for term in df.values:
    
    #Spliting the array
    string_split = term[0].split()

    #Formatting the data to this format: CS 1738
    course = string_split[0] + " " + string_split[1]

    #Updating the data to its respective list/dictionary
    list_of_major_acronyms.append(string_split[0])
    course_and_prereqs[course] = []
    list_of_courses.append(course)

#Parsing through the prerequiste data by looking for words in the list_of_major_acronyms array and taking that specific value + the number after it
for term in df.values:

    #Splitting the Course String
    string_split = term[0].split()
    course = string_split[0] + " " + string_split[1]


    #Checking if there is no prerequiste
    if type(term[1]) == str:
        #Splitting the prerequsite string
        string_split = term[1].split()

        for i in range(len(string_split)):

            #Checking if the word is a major acronym
            if string_split[i] in list_of_major_acronyms:

                #Formatting to this format: CS 1738
                prereq = string_split[i] + " " + string_split[i+1]

                #Checking if it is a current course and not an old course
                if prereq in list_of_courses:
                    previous_prereq_array = course_and_prereqs[course]
                    previous_prereq_array.append(prereq)
                    course_and_prereqs[course] = previous_prereq_array


################################################################Preparing the major courses into a csv file#############################################
                    
#Reading the required courses file
new_file = pd.read_csv("Computer Science.csv") #This will be any major you want
courses_required = []


#Appending the csv file data to an arrary
for term in new_file.values:
    courses_required.append(term[0])

#Removing this course that is in every major
courses_required.remove('CPU 3003')
finaljson = []

#Only including courses in the prereqs that are major required
for course in courses_required:
    former_prereqs = course_and_prereqs[course]
    updated_prereqs = []
    for term in former_prereqs:
        if term in courses_required:
            updated_prereqs.append(term)
    finaljson.append({
        "courseID": course,
        "PreReqs": updated_prereqs
    })

file_path = "course.json"

# Write the data to the JSON file
with open(file_path, "w") as json_file:
    json.dump(finaljson, json_file)
