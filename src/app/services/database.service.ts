import { Injectable, signal } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { BehaviorSubject } from 'rxjs';


const DB_EMPLOYEES = 'employeedb';

export type employee = {
  id?: number,
  employee_id?: number,
  active?: number,
  name: string,
  department: string,
  position: string,
  email: string,
  phone: string,
  salary: number
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private readonly sqlite = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  public employees = signal<employee[]>([])
  employeeSubjectBehavior = new BehaviorSubject<employee[]>([])
 


  constructor() {

  }

  async initializePlugin() {

    this.db = await this.sqlite
      .createConnection(DB_EMPLOYEES, false, 'no-encrption', 1, false)

    await this.db.open()

    // Your database operations here
    const SCHEMA = `CREATE TABLE IF NOT EXISTS employees(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          active INTEGER DEFAULT 1,
          employee_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          department TEXT NOT NULL,
          position TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          salary REAL
        );`;

   await this.db.execute(SCHEMA)

    this.loadEmployees()
    await this.db.close()

  }


  loadEmployees() {
    this.db.query(`SELECT * FROM employees;`).then((employees) => {
      this.employees.update((value)=>value=employees.values!)
      this.employeeSubjectBehavior.next(employees.values!)
    });
  }

  async addEmployee(emp: employee) {
    await this.db.open()
    const query = `INSERT INTO employees (employee_id,name,department,position,email,phone,salary) 
        VALUES (?,?,?,?,?,?,?);`;

    const result = await this.db.run(query,
      [emp.employee_id, emp.name, emp.department, emp.position, emp.email, emp.phone, emp.salary]);

    this.loadEmployees()
    await this.db.close()

    return result
  }


  async updateEmployeeStatus(emp: employee) {
    await this.db.open()
    let id = emp.id!
    const query = `UPDATE employees 
    SET active = ?,name = ?, department = ?, position = ?, email = ?, phone = ?, salary = ?
    WHERE id=?;`;

    const result = await this.db.run(query,
      [emp.active,emp.name, emp.department, emp.position, emp.email, emp.phone, emp.salary, id]);

    this.loadEmployees()
    await this.db.close()

    return result
  }

  async deleteEmployee(id: any) {
    await this.db.open()
    const query = `DELETE FROM employees WHERE id=${id};`;

    const result = await this.db.query(query);

    this.loadEmployees()

    await this.db.close()

    return result
  }


  get employeesObservable() {
    return this.employeeSubjectBehavior.asObservable()
  }

}
