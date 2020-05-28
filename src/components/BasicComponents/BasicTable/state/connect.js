import { connect as contextConnect } from "../../../../store/provider"
import { BasicTableContext } from "../index"

const connect = (mapStateToProps, mapDispatchToProps) =>
  contextConnect(mapStateToProps, mapDispatchToProps, BasicTableContext)

export default connect
