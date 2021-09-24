import { toast, setDefaults } from 'bulma-toast'

setDefaults({
  duration: 3000,
  position: 'top-center',
})

function infoToast(message) {
  toast({
    message: `<span class="icon"> <i class="far fa-check-circle"></i></span> ${message}`,
  })
}

export { infoToast }
