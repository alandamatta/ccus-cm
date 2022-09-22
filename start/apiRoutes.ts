import Route from '@ioc:Adonis/Core/Route'

const apiRoutes = () => {
  Route.post('/v1/children/enroll', 'Api/ChildEnrollmentController.enroll')
}

export default apiRoutes
