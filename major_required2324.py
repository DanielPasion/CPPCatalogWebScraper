from selenium import webdriver
from selenium.webdriver.common.by import By
import re
import csv

#Used to scrape the required courses from the major
def find_major_required(major,catalog_url):

    #Creating the scraper
    browser = webdriver.Chrome()
    browser.get(catalog_url)

    major_required = browser.find_elements(By.CLASS_NAME, "acalog-course")
    major_required_array = [major]
    for element in major_required:
        spliced_text = element.text.split()
        major_required_array.append(spliced_text[0] + " " + spliced_text[1])
    browser.quit()

    # #Sanitizing the major to actually list the major
    # spliced_major = major.split()
    # i = 0
    # new_major = ""

    # while True:
    #     regex = re.match("\w+\,",spliced_major[i])
    #     if regex:
    #         new_major += spliced_major[i][:-1]
    #         break
    #     else:
    #         new_major += spliced_major[i]
    #         new_major += " "
    #         i += 1
    

    csv_file = "23-24RequiredCourses/" + major.replace(" ", "")[:10] + '.csv'

    # Reshape the 1D array into a 2D array with one column
    data_2d = [[item] for item in major_required_array]

    # Write the 2D array to the CSV file
    with open(csv_file, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(data_2d)


#Setting the urls and chrome driver path
url = 'https://catalog.cpp.edu/content.php?catoid=65&navoid=5519'

#Using Index of Academic Programs to scrape through each major
browser = webdriver.Chrome()
browser.get(url)
for i in range(1,108):
    current = browser.find_elements(By.XPATH, '//*[@id="main"]/div/table/tbody/tr[2]/td[2]/table/tbody/tr/td/ul[1]/li[' + str(i) + ']/a')
    
    major = current[0].text
    link = current[0].get_attribute("href")
    find_major_required(major,link)


