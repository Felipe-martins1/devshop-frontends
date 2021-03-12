import React from 'react'

import Layout from '../../components/Layout'
import Title from '../../components/Title'
import Input from '../../components/Input'
import Button from '../../components/Button'

import { useMutation, fetcher } from '../../lib/graphql'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'

import * as Yup from 'yup'

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
const CategorySchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Por favor, informe um nome com no mínimo 3 caracteres.')
    .required('Por favor, informe um nome.'),

  slug: Yup.string()
    .min(3, 'Por favor, informe um slug com no mínimo 3 caracteres')
    .required('Por favor, informe um slug')
    .test(
      'is-unique',
      'Por favor, utilize outro slug. Este já está em uso.',
      async value => {
        const ret = await fetcher(
          JSON.stringify({
            query: `
            query{
              getCategoryBySlug(slug:"${value}"){
                id
              }
            }
          `
          })
        )
        if (ret.errors) {
          return true
        }
        return false
      }
    )
})
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
    validationSchema: CategorySchema,
    onSubmit: async values => {
      //Usando mutation
      const data = await createCategory(values)
      if (data && !data.errors) {
        //Redirecionando
        router.push('/categories')
      }
    }
  })
  return (
    <Layout>
      <Title>Criar nova categoria</Title>
      <Button.Link href='/categories'>Voltar</Button.Link>
      <div className='flex flex-col mt-8'>
        <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
          <div className='align-middle inline-block min-w-full bg-white shadow overflow-hidden sm:rounded-lg border-b border-gray-200 p-12'>
            {data && !!data.errors && (
              <p className='mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'>
                Ocorreu um erro inesperado.
              </p>
            )}
            <form onSubmit={form.handleSubmit}>
              <div className='flex flex-wrap -mx-3 mb-6'>
                <Input
                  label='Nome da categoria'
                  placeholder='Preencha com o nome da categoria'
                  type='text'
                  name='name'
                  onChange={form.handleChange}
                  value={form.values.name}
                  errorMessage={form.errors.name}
                />
                <Input
                  label='Slug da categoria'
                  placeholder='Preencha com o slug da categoria'
                  type='text'
                  name='slug'
                  onChange={form.handleChange}
                  value={form.values.slug}
                  helpText='Slug é utilizado para URLs amigáveis'
                  errorMessage={form.errors.slug}
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
