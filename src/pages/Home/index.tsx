import { HandPalm, Play } from "phosphor-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod"

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";
import { useContext } from "react";
import { NewCycleForm } from "./NewCycleForm/index.tsx";
import { CountDown } from "./CountDown/index.tsx";
import { CyclesContext } from "../../contexts/CyclesContext.tsx";



// interface NewCycleFormData {
//   task: string
//   minutesAmount: number
// }



export function Home() {
  const { createNewCycle, interruptCurrentCycle, activeCycle } = useContext(CyclesContext)

  //Schema porque usa Schema based
  //precisa criar um objeto com o zod.object e com as keys do form submit e colocar o schema de validação e em seguida a mensagem
  const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, "Informe a tarefa"),
    minutesAmount: zod.number().min(5).max(60),
  })

  //formState recupera o erro informado no schemaform com o formState.error
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
    }
  })

  const { handleSubmit, watch, reset } = newCycleForm

  function handleCreateNewCycle(data: NewCycleFormData) {

    createNewCycle(data)
     //precisa preencher o defaultValues para funcionar o reset
    reset()
  }

  //infere os tipos diretamente com o zod, não sendo necessario criar o interface
  type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

  const task = watch("task")
  const isSubmitDisabled = !task


  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">     
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <CountDown />
        {
          activeCycle ? (
            <StopCountdownButton onClick={interruptCurrentCycle} type="button" >
              <HandPalm size={24} />Interromper
            </StopCountdownButton>
          ) : (
            <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
              <Play size={24} />Começar
            </StartCountdownButton>
          )
        }
      </form>
    </HomeContainer>
  )
}