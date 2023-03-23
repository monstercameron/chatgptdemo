class Employee:
    def __init__(self, row):
        self.NodeID = row[0]
        self.EEID = row[1]
        self.COID = row[2]
        self.EmployeeName = row[3]
        self.CompanyName = row[4]
        self.Location = row[5]
        self.WorkPhoneExt = row[6]
        self.WorkPhoneNumber = row[7]
        self.WorkPhoneCountry = row[8]
        self.HomePhoneNumber = row[9]
        self.HomePhoneCountry = row[10]
        self.LastHireDate = row[11]
        self.OriginalHireDate = row[12]
        self.SeniorityDate = row[13]
        self.OrgLvl1Code = row[14]
        self.OrgLvl2Code = row[15]
        self.OrgLvl3Code = row[16]
        self.OrgLvl4Code = row[17]
        self.OrgLvl1Desc = row[18]
        self.OrgLvl2Desc = row[19]
        self.OrgLvl3Desc = row[20]
        self.OrgLvl4Desc = row[21]
        self.SupervisorID = row[22]
        self.ManagerName = row[23]
        self.JobDescription = row[24]
        self.ChildCount = row[25]
        self.lvl = row[26]
        self.ImageName = row[27]
        self.PhotoFileBinary = row[28]
        self.SupervisorCount = row[29]
        self.SupervisorInfo = row[30]
        self.EecEEType = row[31]
        self.EecFullTimeOrPartTime = row[32]
        self.EmployeeNumber = row[33]
        self.JobCode = row[34]
        self.DateInJob = row[35]
        self.EecPayGroup = row[36]
        self.IndirectReportCount = row[37]
        self.parentNodeId = row[38]

    def to_dict(self):
        # return a dictionary of the Employee object's attributes
        return self.__dict__

    def __repr__(self):
        return f"Employee({self.EmployeeName}, {self.ManagerName})"

    def generate_employee_summary(self):
        summary = f"org chart ranking {self.NodeID}/{self.parentNodeId} {self.EmployeeName} works for {self.CompanyName} as a {self.JobDescription} and was hired on {self.OriginalHireDate}. They are located in {self.Location} and have work/home phone numbers {self.WorkPhoneNumber}/{self.HomePhoneNumber} and I report to {self.ManagerName}."
        return summary

    def create_employee_tree(employees, manager_name=None):
        tree = {}
        for employee in employees:
            if employee.ManagerName == manager_name or (manager_name is None and not employee.ManagerName):
                subordinates = create_employee_tree(
                    employees, employee.EmployeeName)
                if subordinates:
                    employee.__dict__['subordinates'] = subordinates
                tree[employee.EmployeeName] = employee.__dict__
        return tree

    def create_employee_hierarchy(employees):
        employee_dict = {}
        for employee in employees:
            manager = employee.ManagerName
            if manager:
                if manager not in employee_dict:
                    employee_dict[manager] = []
                employee_dict[manager].append(employee)
        return employee_dict

    def generate_employee_summary2(employee_dict):
        summary = []
        for manager, subordinates in employee_dict.items():
            for employee in subordinates:
                summary.append({
                    "NodeID": employee.NodeID,
                    "EEID": employee.EEID,
                    "COID": employee.COID,
                    "EmployeeName": employee.EmployeeName,
                    "Location": employee.Location,
                    "SeniorityDate": employee.SeniorityDate,
                    "ManagerName": employee.ManagerName,
                    "parentNodeId": employee.parentNodeId,
                })
        return summary
