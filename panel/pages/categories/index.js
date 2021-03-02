import React from 'react'
import Card from '../../components/Card'
import Layout from '../../components/Layout'
import Title from '../../components/Title'
import { useQuery } from '../../lib/graphql'
import { BsClipboardData } from 'react-icons/bs'
import { FiEdit2 } from 'react-icons/fi'
import Table from '../../components/Table'

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
  const { data, error } = useQuery(GET_ALL_CATEGORIES)
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
          <div className='align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200'>
            <Table>
              <Table.Head>
                <Table.Th>Name</Table.Th>
                <Table.Th>Slug</Table.Th>
                <Table.Th></Table.Th>
              </Table.Head>

              <Table.Body>
                {data &&
                  data.getAllCategories &&
                  data.getAllCategories.map(item => (
                    <Table.Tr key={item.id}>
                      <Table.Td>
                        <div className='flex items-center'>
                          <div>
                            <div className='text-sm leading-5 font-medium text-gray-900'></div>
                            <div className='text-sm leading-5 text-gray-500'>
                              {item.name}
                            </div>
                          </div>
                        </div>
                      </Table.Td>

                      <Table.Td>
                        <div className='text-sm leading-5 text-gray-900'>
                          {item.slug}
                        </div>
                      </Table.Td>

                      <Table.Td>
                        <div className='flex items-center text-indigo-600'>
                          <a href='#' className='hover:text-indigo-900'>
                            Edit
                          </a>
                          <FiEdit2 className='ml-2 hover:text-indigo-900' />
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Index
