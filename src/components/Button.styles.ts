import styled, {css} from "styled-components"

export type ButtonVariant = "primary" | "secondary" | "danger" | "success"

interface ButtonContainerProps {
  variant: ButtonVariant
}

const buttonVariants = {
  primary: "purple",
  secondary: "orange",
  danger: "red",
  success: "green"
}

export const ButtonContainer = styled.button<ButtonContainerProps>`
  height: 5rem;
  margin-right: 2rem;

  background-color: ${props => props.theme["green-500"]}
  /* ${props => {
    return css`background-color: ${buttonVariants[props.variant]}`
  }} */
`