'use client'

import { saveColor } from '@/actions/colors/save-color'
import appEndpoints from '@/app/api/app.endpoints'
import { AlertModal } from '@/components/modals/alert-modal'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Heading } from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Color } from '@/interfaces'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import z from 'zod'

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
})

type ColorFormValues = z.infer<typeof formSchema>

interface ColorFormProps {
  initialData: Color | null
}

export const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const params = useParams()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const title = initialData ? 'Editar' : 'Crear nueva'
  const description = initialData ? 'Editar existente' : 'Crear nueva'
  const toastMessage = initialData ? 'Editado con exito' : 'Creada con exito'
  const action = initialData ? 'Guardar cambios' : 'Crear'

  const onDelete = async () => {
    try {
      setIsLoading(true)
      await axios.delete(`${appEndpoints.colors}/${params.colorId}`)
      router.refresh()
      router.push(`/colors`)
      toast.success('Color deleted.')
    } catch (error: any) {
      toast.error('Make sure you removed all products using this color first.')
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  const onSubmit = async (data: ColorFormValues) => {
    try {
      setIsLoading(true)
      if (initialData) {
        await axios.put(
          `${appEndpoints.colors}/${params.colorId}?storeId=${params.storeId}`,
          data,
        )
      } else {
        await saveColor(params.storeId, data)
      }
      router.refresh()
      router.back()
      toast.success(toastMessage)
    } catch (error: any) {
      console.log('[CLIENT] error posting ---->', error)
      toast.error('Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: '',
    },
  })

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onDelete}
        loading={isLoading}
      />
      <div className='flex items-center justify-between gap-4'>
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isLoading}
            variant='destructive'
            size='sm'
            onClick={() => setIsOpen(true)}
            aria-label='Delete'
            title='Delete'
          >
            <Trash className='h-4 w-4' />
            Eliminar talla
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 w-full'
        >
          <div className='md:grid md:grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder='Black'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='value'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder='#000' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={isLoading}
            className='ml-auto'
            type='submit'
            size='smFlexMdFull'
            aria-label='action'
            title='action'
          >
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}
