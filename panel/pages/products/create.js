import React, { useEffect } from 'react'

import Layout from '../../components/Layout'
import Title from '../../components/Title'
import Input from '../../components/Input'
import Button from '../../components/Button'

import { useMutation, useQuery } from '../../lib/graphql'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import Select from '../../components/Select'

const CREATE_PRODUCT = `
    mutation createProduct($name: String!, $slug: String!, $description: String!, $category: String!){
      createProduct (input:{
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
const Index = () => {
  //Inicia o Router(Usado para redirecionar para a página /categories)
  const router = useRouter()

  //UseMutation(Usando a função criada na lib para puxar a função que executa a mutation)
  const [data, createProduct] = useMutation(CREATE_PRODUCT)
  const { data: categories, mutate } = useQuery(GET_ALL_CATEGORIES)

  //Criando form usando Formik
  const form = useFormik({
    initialValues: {
      name: '',
      slug: '',
      description: '',
      category: ''
    },
    onSubmit: async values => {
      //Usando mutation
      await createProduct(values)

      //Redirecionando
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

  useEffect(() => {
    if (categories && categories.getAllCategories) {
      form.setFieldValue('category', categories.getAllCategories[0].id)
    }
  }, [categories])
  return (
    <Layout>
      <Title>Criar novo produto</Title>
      <Button.Link href='/products'>Voltar</Button.Link>
      <div className='flex flex-col mt-8'>
        <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
          <div className='align-middle inline-block min-w-full bg-white shadow overflow-hidden sm:rounded-lg border-b border-gray-200 p-12'>
            <form onSubmit={form.handleSubmit}>
              <div className='flex flex-wrap -mx-3 mb-6'>
                <Input
                  label='Nome do Produto'
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
              <Button type='submit'>Criar produto</Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Index
