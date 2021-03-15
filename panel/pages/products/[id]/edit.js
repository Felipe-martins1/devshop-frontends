import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import Layout from '../../../components/Layout'
import Select from '../../../components/Select'
import Title from '../../../components/Title'
import { useMutation, useQuery, fetcher } from '../../../lib/graphql'

import * as Yup from 'yup'

let id = ''

const UPDATE_PRODUCT = `
    mutation updateProduct($id: String! $name: String!, $slug: String!, $description: String!, $category: String!){
      updateProduct (input:{
        id: $id,
        name: $name,
        slug: $slug,
        description: $description,
        category: $category
      }){
        id
        name
        slug
    }
  }
  `

const GET_ALL_CATEGORIES = `
  query{
    getAllCategories{
      id
      name
      slug
  }
}
`

const ProductSchema = Yup.object().shape({
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
              getProductBySlug(slug:"${value}"){
                id
              }
            }
          `
          })
        )
        if (ret.errors) {
          return true
        }
        if (ret.data.getProductBySlug.id === id) {
          return true
        }
        return false
      }
    ),
  description: Yup.string()
    .min(20, 'Por favor, informe uma descrição com no mínimo 20 caracteres.')
    .required('Por favor, informe uma descrição.'),
  category: Yup.string()
    .min(1, 'Por favor, selecione uma categoria.')
    .required('Por favor, selecione uma categoria')
})

const Edit = () => {
  //Iniciando o router
  const router = useRouter()
  id = router.query.id

  //Buscando dados do servidor
  const { data } = useQuery(`
  query{
    getProductById(id: "${router.query.id}"){
      name
      slug
      category
      description
    }
  }`)

  //UseMutation(Usando a função criada na lib para puxar a função que executa a mutation)
  const [updatedData, updateProduct] = useMutation(UPDATE_PRODUCT)
  const { data: categories, mutate } = useQuery(GET_ALL_CATEGORIES)
  //Criando form utilizando Formik
  const form = useFormik({
    initialValues: {
      name: '---',
      slug: '---',
      description: '--------------------'
    },
    validationSchema: ProductSchema,
    onSubmit: async values => {
      const product = {
        ...values,
        id: router.query.id
      }
      const data = await updateProduct(product)
      if (data && !data.errors) {
        //Redirecionando
        router.push('/products')
      }
    }
  })

  let options = []
  if (categories && categories.getAllCategories) {
    options = categories.getAllCategories.map(item => {
      return {
        id: item.id,
        label: item.name
      }
    })
  }

  //Passando dados para o formulario
  useEffect(() => {
    if (data && data.getProductById) {
      form.setFieldValue('name', data.getProductById.name)
      form.setFieldValue('description', data.getProductById.description)
      form.setFieldValue('slug', data.getProductById.slug)
      form.setFieldValue('category', data.getProductById.category)
    }
  }, [data])
  return (
    <Layout>
      <Title>Editar produto</Title>
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
                  label='Nome do produto'
                  placeholder='Preencha com o nome do produto'
                  type='text'
                  name='name'
                  onChange={form.handleChange}
                  value={form.values.name}
                  errorMessage={form.errors.name}
                />
                <Input
                  label='Descrição do produto'
                  placeholder='Preencha com a descrição do produto'
                  type='text'
                  name='description'
                  onChange={form.handleChange}
                  value={form.values.description}
                  errorMessage={form.errors.description}
                />
                <Input
                  label='Slug do produto'
                  placeholder='Preencha com o slug do produto'
                  type='text'
                  name='slug'
                  onChange={form.handleChange}
                  value={form.values.slug}
                  helpText='Slug é utilizado para URLs amigáveis'
                  errorMessage={form.errors.slug}
                />
                <Select
                  label='Selecione a categoria'
                  name='category'
                  onChange={form.handleChange}
                  value={form.values.category}
                  options={options}
                  errorMessage={form.errors.category}
                  initial={{ id: '', label: 'Selecione...' }}
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
