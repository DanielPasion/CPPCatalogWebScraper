from selenium import webdriver
from selenium.webdriver.common.by import By
import re
import csv

#Used to scrape the required courses from the major
def find_major_required(yearstring,iteration,major,catalog_url):

    #Creating the scraper
    browser = webdriver.Chrome()
    browser.get(catalog_url)

    #Splitting up the name of the major
    major_required = browser.find_elements(By.CLASS_NAME, "acalog-course")
    major_required_array = [major]
    for element in major_required:
        spliced_text = element.text.split()
        major_required_array.append(spliced_text[0] + " " + spliced_text[1])
        
    browser.quit()
    csv_file = "RequiredCourses/" + yearstring + "RequiredCourses/" + str(iteration) + major.replace(" ", "")[:10] + '.csv'

    # Reshape the 1D array into a 2D array with one column
    data_2d = [[item] for item in major_required_array]

    # Write the 2D array to the CSV file
    with open(csv_file, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(data_2d)


#Setting the urls and chrome driver path
#Using Index of Academic Programs to scrape through each major
browser = webdriver.Chrome()

# year2324 = 'https://catalog.cpp.edu/content.php?catoid=65&navoid=5519'
# yearstring = '23-24'
# browser.get(year2324)

# year2223 ='https://catalog.cpp.edu/content.php?catoid=61&navoid=4876'
# yearstring = '22-23'
# browser.get(year2223)

# year2122 ='https://catalog.cpp.edu/content.php?catoid=57&navoid=4359'
# yearstring = '21-22'
# browser.get(year2122)

# year2021 ='https://catalog.cpp.edu/content.php?catoid=53&navoid=3972'
# yearstring = '20-21'
# browser.get(year2021)

# year2021 ='https://catalog.cpp.edu/content.php?catoid=53&navoid=3972'
# yearstring = '20-21'
# browser.get(year2021)

year1920 ='https://catalog.cpp.edu/content.php?catoid=53&navoid=3972'
yearstring = '19-20'
browser.get(year1920)


for i in range(1,120): #2324 = 109, 2223 = 108, 2122 = 104, 2021 = 104
    current = browser.find_elements(By.XPATH, '//*[@id="main"]/div/table/tbody/tr[2]/td[2]/table/tbody/tr/td/ul[1]/li[' + str(i) + ']/a')
    
    major = current[0].text
    link = current[0].get_attribute("href")
    find_major_required(yearstring,i,major,link)