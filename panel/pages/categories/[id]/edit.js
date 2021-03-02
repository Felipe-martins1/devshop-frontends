import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Layout from '../../../components/Layout'
import Title from '../../../components/Title'
import { useMutation, useQuery } from '../../../lib/graphql'

const UPDATE_CATEGORY = `
    mutation updateCategory($id: String! $name: String!, $slug: String!){
      updateCategory (input:{
        id: $id
        name: $name,
        slug: $slug
      }){
        id
        name
        slug
    }
  }
  `

const Edit = () => {
  //Iniciando o router
  const router = useRouter()

  //Buscando dados do servidor
  const { data } = useQuery(`
  query{
    getCategoryById(id: "${router.query.id}"){
      id
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
    onSubmit: async values => {
      const category = {
        ...values,
        id: router.query.id
      }
      await updateCategory(category)
      router.push('/categories')
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
          <div className='align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200'></div>
          <form onSubmit={form.handleSubmit}>
            <input
              className='p-2 font-semibold rounded shadow-md outline-none focus:ring-2 focus:ring-blue-600 '
              type='text'
              name='name'
              onChange={form.handleChange}
              value={form.values.name}
            />
            <input
              className='p-2 ml-2 font-semibold rounded shadow-md outline-none focus:ring-2 focus:ring-blue-600'
              type='text'
              name='slug'
              onChange={form.handleChange}
              value={form.values.slug}
            />
            <button
              className='ml-2 bg-indigo-600 rounded p-2 text-white font-semibold '
              type='submit'
            >
              Salvar categoria
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default Edit