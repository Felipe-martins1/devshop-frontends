import React from 'react'
import Card from '../../components/Card'
import Layout from '../../components/Layout'
import Title from '../../components/Title'
import { useMutation, useQuery } from '../../lib/graphql'
import { BsClipboardData, BsTrash } from 'react-icons/bs'
import { FiEdit2 } from 'react-icons/fi'
import Table from '../../components/Table'

import Link from 'next/link'

//Definindo Mutation
const DELETE_CATEGORY = `
mutation createCategory($id: String!){
  deleteCategory (id: $id)
}`

//DEfinindo Query
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
  //Buscando dados
  const { data, mutate } = useQuery(GET_ALL_CATEGORIES)

  //Usando Mutation
  const [deleteData, deleteCategory] = useMutation(DELETE_CATEGORY)
  const remove = id => async () => {
    await deleteCategory({ id })
    //Recarrega os dados
    mutate()
  }
  return (
    <Layout>
      <Title>Gerenciar categorias</Title>
      <div className='mt-4'>
        <div className='flex flex-wrap -mx-6'>
          <Card>
            <Card.Icon>
              <BsClipboardData className='h-8 w-8 text-white' />
            </Card.Icon>
            <Card.Data>
              {data && data.getAllCategories && (
                <Card.Title>{data.getAllCategories.length}</Card.Title>
              )}
              <Card.Description>Categorias</Card.Description>
            </Card.Data>
          </Card>
        </div>
      </div>
      <div className='mt-8'></div>
      <div className='flex flex-col mt-8'>
        <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
          {data && data.getAllCategories && (
            <div className='align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200'>
              <Table>
                {data.getAllCategories.length > 0 && (
                  <Table.Head>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Slug</Table.Th>
                    <Table.Th></Table.Th>
                  </Table.Head>
                )}
                <Table.Body>
                  {data.getAllCategories.map(item => (
                    <Table.Tr key={item.id}>
                      <Table.Td>
                        <div className='flex items-center'>
                          <div>
                            <div className='leading-5 font-semibold text-gray-900'></div>
                            <div className='leading-5 font-semibold text-gray-900'>
                              {item.name}
                            </div>
                          </div>
                        </div>
                      </Table.Td>

                      <Table.Td>
                        <div className='leading-5 font-semibold text-gray-500'>
                          {item.slug}
                        </div>
                      </Table.Td>

                      <Table.Td>
                        <div className='flex items-center font-semibold text-indigo-600'>
                          <Link href={`/categories/${item.id}/edit`}>
                            <a className='flex items-center mr-2 mt-1 hover:text-indigo-900'>
                              <span>Edit</span>
                              <FiEdit2 className='ml-1' />
                            </a>
                          </Link>
                          |
                          <a
                            href='#'
                            className='flex items-center ml-2 mt-1 hover:text-red-500'
                            onClick={remove(item.id)}
                          >
                            <BsTrash className='ml-1' />
                          </a>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                  {data.getAllCategories.length === 0 && (
                    <div
                      className='bg-opacity-40 bg-red-500 border-l-4 border-red-700 text-red-700 p-7 text-xl'
                      role='alert'
                    >
                      <p>Nenhuma categoria criada!</p>
                    </div>
                  )}
                </Table.Body>
              </Table>
            </div>
          )}
          <Link href='/categories/create'>
            <button className='mt-5 bg-indigo-600 bg-opacity-75 rounded p-2 text-white font-semibold hover:bg-opacity-100 duration-200'>
              Criar categoria
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  )
}
export default Index
