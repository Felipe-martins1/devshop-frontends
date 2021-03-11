import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import Layout from '../../../components/Layout'
import Select from '../../../components/Select'
import Title from '../../../components/Title'
import { useMutation, useQuery } from '../../../lib/graphql'

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

const Edit = () => {
  //Iniciando o router
  const router = useRouter()

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
      name: '',
      slug: ''
    },
    onSubmit: async values => {
      const product = {
        ...values,
        id: router.query.id
      }
      await updateProduct(product)
      router.push('/products')
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
            <form onSubmit={form.handleSubmit}>
              <div class='flex flex-wrap -mx-3 mb-6'>
                <Input
                  label='Nome do produto'
                  placeholder='Preencha com o nome do produto'
                  type='text'
                  name='name'
                  onChange={form.handleChange}
                  value={form.values.name}
                />
                <Input
                  label='Descrição do produto'
                  placeholder='Preencha com a descrição do produto'
                  type='text'
                  name='description'
                  onChange={form.handleChange}
                  value={form.values.description}
                />
                <Input
                  label='Slug do produto'
                  placeholder='Preencha com o slug do produto'
                  type='text'
                  name='slug'
                  onChange={form.handleChange}
                  value={form.values.slug}
                  helpText='Slug é utilizado para URLs amigáveis'
                />
                <Select
                  label='Selecione a categoria'
                  name='category'
                  onChange={form.handleChange}
                  value={form.values.category}
                  options={options}
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
