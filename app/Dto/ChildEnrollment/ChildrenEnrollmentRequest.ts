import ParentInfo from 'App/Dto/ChildEnrollment/ParentInfo'
import ChildInfo from 'App/Dto/ChildEnrollment/ChildInfo'

export default class ChildrenEnrollmentRequest {
  public code: number
  public locationId: number
  public filler: ParentInfo
  public contact: ParentInfo
  public children: ChildInfo[]
}
