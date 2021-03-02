import React from 'react'

import Layout from '../../components/Layout'
import Title from '../../components/Title'
import Input from '../../components/Input'
import Button from '../../components/Button'

import { useMutation } from '../../lib/graphql'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'

const CREATE_CATEGORY = `
    mutation createCategory($name: String!, $slug: String!){
      createCategory (input:{
        name: $name,
        slug: $slug
      }){
        id
        name
        slug
    }
  }
  `
const Index = () => {
  //Inicia o Router(Usado para redirecionar para a página /categories)
  const router = useRouter()

  //UseMutation(Usando a função criada na lib para puxar a função que executa a mutation)
  const [data, createCategory] = useMutation(CREATE_CATEGORY)

  //Criando form usando Formik
  const form = useFormik({
    initialValues: {
      name: '',
      slug: ''
    },
    onSubmit: async values => {
      //Usando mutation
      await createCategory(values)

      //Redirecionando
      router.push('/categories')
    }
  })
  return (
    <Layout>
      <Title>Criar nova categoria</Title>
      <Button.Link href='/categories'>Voltar</Button.Link>
      <div className='flex flex-col mt-8'>
        <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
          <div className='align-middle inline-block min-w-full bg-white shadow overflow-hidden sm:rounded-lg border-b border-gray-200 p-12'>
            <form onSubmit={form.handleSubmit}>
              <div class='flex flex-wrap -mx-3 mb-6'>
                <Input
                  label='Nome da categoria'
                  placeholder='Preencha com o nome da categoria'
                  type='text'
                  name='name'
                  onChange={form.handleChange}
                  value={form.values.name}
                />
                <Input
                  label='Slug da categoria'
                  placeholder='Preencha com o nome da categoria'
                  type='text'
                  name='slug'
                  onChange={form.handleChange}
                  value={form.values.slug}
                  helpText='Slug é utilizado para URLs amigáveis'
                />
              </div>
              <Button type='submit'>Criar categoria</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Index
