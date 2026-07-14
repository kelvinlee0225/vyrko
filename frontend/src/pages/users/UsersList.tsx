import { useState } from 'react'
import { CatalogoSection } from '../../components/catalogos/CatalogoSection'
import { UsuarioModal } from '../../components/users/UsuarioModal'
import { useApiList } from '../../hooks/useApiList'
import { useAuth } from '../../context/useAuth'
import { usuarioService, type Usuario } from '../../services/usuario'

export function UsersList() {
  const { user: currentUser } = useAuth()
  const usuarios = useApiList(usuarioService.list)
  // undefined = modal cerrado; null = crear; objeto = editar.
  const [usuarioModal, setUsuarioModal] = useState<Usuario | null | undefined>(undefined)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl">Usuarios</h1>
        <p className="mt-1 text-[13.5px] text-muted">{usuarios.data.length} usuarios registrados.</p>
      </div>

      <CatalogoSection
        items={usuarios.data}
        loading={usuarios.loading}
        error={usuarios.error}
        columns={[
          { header: 'Nombre', render: (u) => <span className="font-medium">{u.nombre}</span> },
          { header: 'Usuario', render: (u) => <span className="text-muted">{u.username}</span> },
          { header: 'Rol', render: (u) => <span className="text-muted">{u.rol.nombre}</span> },
          {
            header: 'Estado',
            render: (u) => (
              <span
                className={`inline-flex w-fit rounded-full px-2 py-[2px] text-[10px] font-medium ${
                  u.activo ? 'bg-surface-alt text-muted' : 'bg-error-soft text-error'
                }`}
              >
                {u.activo ? 'Activo' : 'Inactivo'}
              </span>
            ),
          },
        ]}
        addLabel="Nuevo usuario"
        emptyMessage="No hay usuarios registrados todavía."
        inUseMessage="No se puede eliminar el usuario porque está en uso en registros existentes."
        confirmDeleteMessage={(u) => `¿Eliminar el usuario "${u.nombre}"?`}
        onDelete={(u) => usuarioService.remove(u.id)}
        onReload={usuarios.reload}
        onEdit={(u) => setUsuarioModal(u)}
        onAdd={() => setUsuarioModal(null)}
        canDelete={(u) => u.id !== currentUser?.id}
      />

      {usuarioModal !== undefined && (
        <UsuarioModal
          usuario={usuarioModal ?? undefined}
          onClose={() => setUsuarioModal(undefined)}
          onSaved={usuarios.reload}
        />
      )}
    </div>
  )
}
