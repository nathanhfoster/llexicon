import { useContext } from "react"
import connect from "./connect"
import { ContextProvider, ContextConsumer, store} from "./provider"

const useState = (context = ContextConsumer) => useContext(context).state

const useDispatch = (context = ContextConsumer) => useContext(context).dispatch

export { connect, ContextProvider, ContextConsumer, useState, useDispatch, store}