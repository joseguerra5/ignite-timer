import { createContext, ReactNode, useReducer, useState } from "react"

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CreateCycleDate {
  task: string;
  minutesAmount: number;
}

//coloca as propriedades aqui para funcionar com o contexto
interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleDate) => void
  interruptCurrentCycle: () => void
}

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}


//contexto para os componentes acessarem as propriedades dessa home
export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
  //o Hook reducer a função recebe o estado e a ação a ser realizada para alterar o resultado
  const [cyclesState, dispatch] = useReducer(
    (state: CyclesState, action: any) => {
    if (action.type === "ADD_NEW_CYCLE") {
      return {
        ...state, 
        cycles: [ ...state.cycles, action.payload.newCycle],
        activeCycleId: action.payload.newCycle.id,
      }
    }
    if (action.type === "INTERRUPT_CURRENT_CYCLE") {
      return {
        ...state, 
        cycles: state.cycles.map(cycle => {
          //se o ciclo do id for igual o ciclo ativo, então vai retornar todos os dados do ciclo e depois adiciona o interruptedDate com a data atual
          if (cycle.id === state.activeCycleId) {
            return { ...cycle, interruptedDate: new Date() }
            //se não retorna o cycle sem adicionar informação
          } else {
            return cycle
          }
        }),
        activeCycleId: null,
      }
    }

    if (action.type === "MARK_CURRENT_CYCLE_AS_FINESHED") {
      return {
        ...state, 
        cycles: state.cycles.map(cycle => {
          //se o ciclo do id for igual o ciclo ativo, então vai retornar todos os dados do ciclo e depois adiciona o interruptedDate com a data atual
          if (cycle.id === state.activeCycleId) {
            return { ...cycle, finishedDate: new Date() }
            //se não retorna o cycle sem adicionar informação
          } else {
            return cycle
          }
        }),
        activeCycleId: null,
      }
    }
    return state;
  }, {
    cycles: [],
    activeCycleId: null,
  })
  //armazena o tantos de segundos que ja se passaram
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { cycles, activeCycleId } = cyclesState
  //const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  //verifica se o ciclo ativo é igual ao ciclo que já está criado
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {

    dispatch({
      type: "MARK_CURRENT_CYCLE_AS_FINESHED",
      payload: {
        activeCycleId
      }
    })
    // setCycles((state) => state.map(cycle => {
    //   //se o ciclo do id for igual o ciclo ativo, então vai retornar todos os dados do ciclo e depois adiciona o interruptedDate com a data atual
    //   if (cycle.id === activeCycleId) {
    //     return { ...cycle, finishedDate: new Date() }
    //     //se não retorna o cycle sem adicionar informação
    //   } else {
    //     return cycle
    //   }
    // }),
    // )
  }

  function createNewCycle(data: CreateCycleDate) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch({
      type: "ADD_NEW_CYCLE",
      payload: {
        newCycle
      }
    })
    //sempre que uma alteração de estado depender dop estado anterior precisa colocar em uma arrow function
    //setCycles((state) => [...state, newCycle])

    //reseta os segundos que se passaram a 0 e evita bugs
    setAmountSecondsPassed(0)

  }

  function interruptCurrentCycle() {
    dispatch({
      type: "INTERRUPT_CURRENT_CYCLE",
      payload: {
        activeCycleId
      }
    })
    

    //fazer o ciclo ativo voltar para nulo, para não reproduzir em tela
    //setActiveCycleId(null)
    //anotar se o ciclo foi interrompido ou não
    // setCycles((state) => state.map(cycle => {
    //   //se o ciclo do id for igual o ciclo ativo, então vai retornar todos os dados do ciclo e depois adiciona o interruptedDate com a data atual
    //   if (cycle.id === activeCycleId) {
    //     return { ...cycle, interruptedDate: new Date() }
    //     //se não retorna o cycle sem adicionar informação
    //   } else {
    //     return cycle
    //   }
    // }))
   }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}>
        {children}
    </CyclesContext.Provider>
  )
}

