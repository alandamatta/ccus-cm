/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ auth, response }) => {
  await auth.use('web').authenticate()
  return response.redirect().toRoute('timesheet.mainPage.init')
})

/*
|--------------------------------------------------------------------------
| Auth
|--------------------------------------------------------------------------
*/
Route.get('/login', 'LoginController.index').as('login')
Route.post('/login', 'LoginController.login')
Route.get('/logout', 'LoginController.logout')

/*
|--------------------------------------------------------------------------
| Location
|--------------------------------------------------------------------------
*/
Route.get('/location', 'LocationsController.index')
  .as('location.index')
  .middleware('adminMiddleware')
Route.get('/location/create', 'LocationsController.indexCreate')
  .as('location.modal.render')
  .middleware('adminMiddleware')
Route.post('/location/create', 'LocationsController.create')
  .as('location.modal.post')
  .middleware('adminMiddleware')
Route.post('/location/create/addTempCourse', 'LocationsController.addTempCourse')
  .as('location.modal.addTempCourse')
  .middleware('adminMiddleware')
Route.post('/location/create/removeTempCourse/:index', 'LocationsController.removeTempCourse')
  .as('location.modal.removeTempCourse')
  .middleware('adminMiddleware')
Route.get('/location/search', 'LocationsController.search')
  .as('location.search')
  .middleware('adminMiddleware')
Route.get('/location/:id', 'LocationsController.find').middleware('adminMiddleware')
Route.get('/location/:id/delete', 'LocationsController.delete').middleware('adminMiddleware')

/*
|--------------------------------------------------------------------------
| Course
|--------------------------------------------------------------------------
*/
Route.get('/course', 'CoursesController.index').as('course.index')
Route.get('/course/create', 'CoursesController.indexCreate').as('course.modal.render')
Route.post('/course/create', 'CoursesController.create').as('course.modal.post')
Route.get('/course/search', 'CoursesController.search').as('course.search')
Route.get('/course/:id', 'CoursesController.find').as('course.find')
Route.get('/course/:id/delete', 'CoursesController.delete').as('course.delete')
/*
|--------------------------------------------------------------------------
| User
|--------------------------------------------------------------------------
*/
Route.get('/user', 'UsersController.index').middleware('adminMiddleware')
Route.get('/user/create', 'UsersController.indexCreate').middleware('adminMiddleware')
Route.post('/user/create', 'UsersController.create').middleware('adminMiddleware')
Route.get('/user/:id', 'UsersController.find').middleware('adminMiddleware')
Route.get('/user/:id/delete', 'UsersController.delete').middleware('adminMiddleware')

/*
|--------------------------------------------------------------------------
| Student
|--------------------------------------------------------------------------
*/
Route.get('/student', 'StudentsController.index').as('student.init')
Route.post('/student/save', 'StudentsController.create').as('student.ajaxSave')
Route.get('/student/:id', 'StudentsController.find').as('student.find')
Route.get('/student/:id/inactivate', 'StudentsController.inactivate').as('student.inactivate')
Route.get('/student/:id/reactivate', 'StudentsController.reactivate').as('student.reactivate')

/*
|--------------------------------------------------------------------------
| Parent
|--------------------------------------------------------------------------
*/
Route.post('/parent/create', 'ParentsController.create').as('parent.create')
Route.get('/parent/setup', 'ParentsController.setUpTheModal').as('parent.setup')

/*
|--------------------------------------------------------------------------
| TimeSheet
|-----------------  ---------------------------------------------------------
*/
Route.get('/timesheet', 'TimesheetController.index').as('timesheet.mainPage.init')
Route.post('/timesheet', 'TimesheetController.index').as('timesheet.mainPage.search')
Route.post('/timesheet/checkIn', 'TimesheetController.checkIn').as('timesheet.mainPage.checkIn')
Route.get('/timesheet/cancel/:attendanceId', 'TimesheetController.cancel').as(
  'timesheet.mainPage.checkIn.cancel'
)

/*
|--------------------------------------------------------------------------
| Files
|-----------------  ---------------------------------------------------------
*/
Route.get('/img/:studentId/:fileName', 'FilesController.image')
Route.get('/file/:studentId/:fileName', 'FilesController.file')
/*
|--------------------------------------------------------------------------
| User Activation
|--------------------------------------------------------------------------
*/
Route.get('/activate/:key', 'UserActivationController.index')
Route.post('/activate/:key', 'UserActivationController.create')
/*
|--------------------------------------------------------------------------
| Reports
|-----------------  ---------------------------------------------------------
*/
Route.get('/attendance', 'ReportsController.index').as('reports.attendance.init')
