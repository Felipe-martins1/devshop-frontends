import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import Layout from '../../../components/Layout'
import Title from '../../../components/Title'
import { useMutation, useQuery, fetcher } from '../../../lib/graphql'

import * as Yup from 'yup'

let id = ''

const UPDATE_CATEGORY = `
    mutation updateCategory($id: String! $name: String!, $slug: String!){
      updateCategory (input:{
        id: $id,
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
        if (ret.data.getCategoryBySlug.id === id) {
          return true
        }
        return false
      }
    )
})

const Edit = () => {
  //Iniciando o router
  const router = useRouter()
  id = router.query.id
  //Buscando dados do servidor
  const { data } = useQuery(`
  query{
    getCategoryById(id: "${router.query.id}"){
      name
      slug
    }
  }`)

  //UseMutation(Usando a função criada na lib para puxar a função que executa a mutation)
  const [updatedData, updateCategory] = useMutation(UPDATE_CATEGORY)

  //Criando form utilizando Formik

  const form = useFormik({
    initialValues: {
      name: '',
      slug: ''
    },
    validationSchema: CategorySchema,
    onSubmit: async values => {
      const category = {
        ...values,
        id: router.query.id
      }
      const data = await updateCategory(category)
      if (data && !data.errors) {
        //Redirecionando
        router.push('/categories')
      }
    }
  })

  //Passando dados para o formulario
  useEffect(() => {
    if (data && data.getCategoryById) {
      form.setFieldValue('name', data.getCategoryById.name)
      form.setFieldValue('slug', data.getCategoryById.slug)
    }
  }, [data])
  return (
    <Layout>
      <Title>Editar categoria</Title>
      <div className='flex flex-col mt-8'>
        <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
          <div className='align-middle inline-block min-w-full shadow bg-white overflow-hidden sm:rounded-lg border-b border-gray-200 p-12'>
            {updatedData && !!updatedData.errors && (
              <p className='mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'>
                Ocorreu um erro inesperado.
              </p>
            )}
            <form onSubmit={form.handleSubmit}>
              <div class='flex flex-wrap -mx-3 mb-6'>
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
                  placeholder='Preencha com o nome da categoria'
                  type='text'
                  name='slug'
                  onChange={form.handleChange}
                  value={form.values.slug}
                  helpText='Slug é utilizado para URLs amigáveis'
                  errorMessage={form.errors.slug}
                />
              </div>
              <Button type='submit'>Salvar</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Edit
