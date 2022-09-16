import Route from '@ioc:Adonis/Core/Route'

const apiRoutes = () => {
  Route.post('/student/enroll', 'Api/ChildEnrollmentController.enroll')
}

export default apiRoutes
