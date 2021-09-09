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
Route.get('/course', 'CoursesController.index')

/*
|--------------------------------------------------------------------------
| Auth
|--------------------------------------------------------------------------
*/
Route.get('/login', 'LoginController.index')
Route.post('/login', 'LoginController.login')
Route.get('/logout', 'LoginController.logout')

/*
|--------------------------------------------------------------------------
| Location
|--------------------------------------------------------------------------
*/
Route.get('/location', 'LocationsController.index').as('location.index')
Route.get('/location/create', 'LocationsController.indexCreate').as('location.modal.render')
Route.post('/location/create', 'LocationsController.create').as('location.modal.post')
Route.post('/location/create/addTempCourse', 'LocationsController.addTempCourse').as(
  'location.modal.addTempCourse'
)
Route.post('/location/create/removeTempCourse/:index', 'LocationsController.removeTempCourse').as(
  'location.modal.removeTempCourse'
)

/*
|--------------------------------------------------------------------------
| User
|--------------------------------------------------------------------------
*/
Route.get('/user', 'UsersController.index')
Route.get('/user/create', 'UsersController.indexCreate')
Route.post('/user/create', 'UsersController.create')

/*
|--------------------------------------------------------------------------
| Student
|--------------------------------------------------------------------------
*/
Route.get('/student', 'StudentsController.index').as('student.mainPage.init')

/*
|--------------------------------------------------------------------------
| TimeSheet
|--------------------------------------------------------------------------
*/
Route.get('/timesheet', 'TimesheetController.index').as('timesheet.mainPage.init')
