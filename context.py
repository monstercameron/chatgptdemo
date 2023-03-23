from collections import Counter
import csv
import statistics
import tiktoken
from employee import Employee

file = 'Diversity Dashboard Export.csv'

def compressContext(file):
    # Initialize a dictionary to store the results
    results = {}

    try:
        # Open the CSV file
        with open(file, 'r') as csv_file:
            # Create a CSV reader object
            csv_reader = csv.DictReader(csv_file)

            # Iterate over each column in the CSV file
            for column_name in csv_reader.fieldnames:
                # Initialize a Counter object for the current column
                column_counter = Counter()

                # Iterate over each row in the CSV file and count the unique values for the current column
                for row in csv_reader:
                    column_value = row[column_name].strip('"')  # remove quotes from value
                    if column_value:  # Only count non-empty values
                        column_counter[column_value] += 1

                # Add the results to the dictionary
                results[column_name] = column_counter

                # Reset the CSV reader to the beginning of the file
                csv_file.seek(0)
                next(csv_reader)

    except FileNotFoundError:
        print("Error: The file could not be found.")
        return ""

    except Exception as e:
        print("An error occurred:", e)
        return ""

    # Remove unnecessary columns
    unnecessary_columns = ['Employee Name', 'Employee Number', 'Last 4 of SSN', 'Hire Date', 'Org Level 1', 'Org Level 2', 'Org Level 3', 'Org Level 4']
    for column_name in unnecessary_columns:
        if column_name in results:
            del results[column_name]

    # Calculate salary statistics
    annual_salaries = [float(salary) for salary, count in results.get('Annual Salary', {}).items() for _ in range(count)]
    if annual_salaries:
        mean_salary = statistics.mean(annual_salaries)
        median_salary = statistics.median(annual_salaries)
        mode_salary = statistics.mode(annual_salaries)
        results['Annual Salary'] = {"Mean Salary": mean_salary, "Median Salary": median_salary, "Mode Salary": mode_salary}
    else:
        print("No annual salaries found.")

    # Create the result string
    result_string = ""
    for column_name, column_counter in results.items():
        if column_counter:
            result_string += f"column:{column_name}:"
            for value, count in column_counter.items():
                result_string += f"{value}:{count},"
        else:
            continue

    # Truncate the result string to 60% of its original length
    end_index = len(result_string) * 60 // 100
    result_string = result_string[:end_index]

    return result_string


def compressContext2(file):
    employees = []
    try:
        # Open the CSV file
        with open(file, 'r') as csvfile:
            # Create a CSV reader object
            reader = csv.reader(csvfile)
            for row in reader:
                # print(row)
                employees.append(Employee(row))
            summary = ''
            for employee in employees:
                summary = summary + employee.generate_employee_summary() + '\n'
            print(summary)
            return summary

    except FileNotFoundError:
        print("Error: The file could not be found.")
        return ""

    except Exception as e:
        print("An error occurred:", e)

# result_string = compressContext(file)

# num_tokens = len(tiktoken.get_encoding("gpt2").encode(result_string))
# print(f"Token count: {num_tokens}")
