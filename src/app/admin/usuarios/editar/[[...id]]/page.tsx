"use client";
import * as React from 'react';
import { AdminHeader } from '../../../components';
import { useUsuarioService } from '../../../../../services/usuario';
import { Field, Form, Formik } from 'formik';

export default function UsuarioEditarPage ({params}: any) {

    const  [ usuario, setUsuario ] = React.useState<any>(null);
    const usuariosSrv:any = useUsuarioService();
    // ======================================================================
    const handleSalvar = async (usuario:any) => {
      if (params?.id) usuariosSrv.editar(usuario);
      else usuariosSrv.cadastrar(usuario);
    }
    // -----------
    const buscarUsuario = async (id:number) => {
      const usuario = await usuariosSrv.buscar(id);
      if (usuario) setUsuario(usuario)
    }
    // -----------
    React.useEffect(() => {
      if (params?.id)
        buscarUsuario(params?.id[0])
    }, [])
    // ======================================================================
    return (
      <main>
            <AdminHeader titulo={(usuario ? 'Editar Usuário' : 'Cadastrar Usuário')}/>
            <h6>Formulário</h6>    

          <Formik
            initialValues={usuario}
            enableReinitialize
            onSubmit={handleSalvar}
          >
            {({}) => (
              <Form>
            <div className="card-body">  
              {/* NOME */}
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-control-label">Nome</label>
                    <Field className="form-control" type="text" name="nome" />
                  </div>
                </div>

                {/* EMAIL */}
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-control-label">Email</label>
                    <Field className="form-control" type="email"  name="email"/>
                  </div>
                </div>

                {/* SENHA */}
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-control-label">Senha</label>
                    <Field className="form-control" type="password" name="senha"/>
                  </div>
                </div>

                {/* ADMIN */}
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-control-label">Nível</label>
                    <Field as="select" className="form-control" name="admin">
                      <option value="false">Usuário</option>
                      <option value="true">Admin</option>
                    </Field>
                  </div>
                </div>

                {/* BOTÃO */}
                <div className="col-md-12">
                  <div className="form-group">
                    <button className='btn btn-primary w-100' type="submit">Salvar</button>
                  </div>
                </div>
              </div>
            </div>
            </Form>)}   
          </Formik>
      </main>
    );
}
