import { useFormContext } from "react-hook-form";
import { FormContainer, MinutesAmountInput, TaskInput } from "./styles.ts";
import { useContext } from "react";
import { CyclesContext } from "../../../contexts/CyclesContext.tsx";

export function NewCycleForm() {
  const {activeCycle} = useContext(CyclesContext)

  //Só funciona se tiver o provider do hookform
  const {register} = useFormContext()


  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
        type="text"
        id="task"
        list="task-suggestions"
        placeholder="Dê um nome para o seu projeto"
        //as duas !! converte o valor para boolean
        disabled={!!activeCycle}
        {...register("task")}
      //controlled components, monitorar a cada transformação
      //onChange={(e) => setTask(e.target.value)}
      //value={task}
      />
      <datalist id="task-suggestions">
        <option value="Projeto 1"></option>
        <option value="Projeto 2"></option>
        <option value="Projeto 3"></option>
        <option value="Banana"></option>
      </datalist>
      <label htmlFor="minutesAmount">durante</label>
      <MinutesAmountInput
        type="number"
        id="minutesAmount"
        placeholder="00"
        {...register("minutesAmount", { valueAsNumber: true })}
        step={5} min={5} max={60} />
      <span>minutos.</span>
    </FormContainer>
  )
}