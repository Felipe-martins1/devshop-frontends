import React from 'react'
import Card from '../../components/Card'
import Layout from '../../components/Layout'
import Title from '../../components/Title'
import { useQuery } from '../../lib/graphql'
import { BsClipboardData } from 'react-icons/bs'
import { FiEdit2 } from 'react-icons/fi'
import Table from '../../components/Table'
import { useFormik } from 'formik'

const query = {
  query: `
    query{
      getAllCategories{
        id
        name
        slug
    }
  }
  `
}
const Index = () => {
  const { data, error } = useQuery(query)
  const form = useFormik({
    initialValues: {
      name: '',
      slug: ''
    },
    onSubmit: values => {
      console.log(values)
    }
  })
  return (
    <Layout>
      <Title>Criar nova categoria</Title>
      <div className='flex flex-col mt-8'>
        <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
          <div className='align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200'></div>
          <form onSubmit={form.handleSubmit}>
            <input
              className='p-2 font-semibold rounded shadow-md outline-none focus:ring-2 focus:ring-blue-600 '
              type='text'
              name='name'
              onChange={form.handleChange}
              values={form.values.name}
            />
            <input
              className='p-2 ml-2 font-semibold rounded shadow-md outline-none focus:ring-2 focus:ring-'
              type='text'
              name='slug'
              onChange={form.handleChange}
              values={form.values.slug}
            />
            <button
              className='ml-2 bg-indigo-600 rounded p-2 text-white font-semibold '
              type='submit'
            >
              Criar categoria
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
export default Index
