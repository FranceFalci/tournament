import { ItemComponent } from './ItemComponent'
import { useFetch } from '../hooks/useFetch'
import { helpHttp } from '../helpers/helpHttp'
import Swal from 'sweetalert2'

const CupsByCategory = ( { idCategory, reload } ) => {
  const { data: cups, setData: setCups } = useFetch( `api/cup/${ idCategory }` )
  const http = helpHttp()
  const onEdit = async ( id, name, order ) => {
    http
      .put( `api/cup/${ id }`, {
        order,
        type: name
      } )
      .then( ( response ) => {
        if ( response === false ) {
          throw Error( 'Ocurrió un error' )
        }
        Swal.fire(
          'Copa editada',
          'Has editado la copa correctamente.',
          'success'
        )
        setCups( ( prevCups ) =>
          prevCups.map( ( cup ) =>
            cup.id_copa === id ? { ...cup, response } : cup
          )
        )
        reload()
      } )
      .catch( ( err ) => {
        Swal.fire( {
          title: 'Ocurrió un error',
          text: err.message,
          icon: 'error'
        } )
      } )
  }

  const onDelete = ( id, name ) => {
    Swal.fire( {
      title: `¿Estás seguro de eliminar ${ name } ?`,
      // text: 'Recuerda que esto implica eliminar los eqruipos pertenecientes a esta zpna y los jugadores perteneciente a los mismos',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    } ).then( async ( result ) => {
      if ( result.isConfirmed ) {
        http
          .del( `api/cup/${ id }` )
          .then( ( response ) => {
            if ( response.ok === false ) {
              throw Error( 'Ocurrió un error' )
            }
            Swal.fire(
              ' Copa eliminada',
              'Has eliminado la copa correctamente.',
              'success'
            )
            setCups( ( prevTeams ) =>
              prevTeams.filter( ( team ) => team.id_equipo !== id )
            )
            reload()
          } )
          .catch( ( err ) => {
            Swal.fire( {
              title: 'Ocurrió un error',
              text: err.message,
              icon: 'error'
            } )
          } )
      }
    } )
  }
  return (
    <div className='d-flex'>
      {cups && (
        <ItemComponent
          items={cups.map( ( cup ) => ( {
            id: cup.id_copa,
            nombre: cup.tipo,
            order: cup.orden
          } ) )}
          onEdit={onEdit}
          onDelete={onDelete}
          redirectLink={'phases'}
          redirectName={'Fases'}
          order={true}
        />
      )}
    </div>
  )
}

export default CupsByCategory
