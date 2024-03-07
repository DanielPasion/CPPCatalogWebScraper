import pandas as pd
import numpy as np
import math

#Method 1: Getting the frequency of every word in the prerequisite category and counting it's frequencies
df = pd.read_csv('2019-2020_Courses.csv')

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

