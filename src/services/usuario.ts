

const UsuarioService = {

    /**
     * Loga usuário
     * @param email 
     * @param senha 
     * @returns {usuario caso logado com sucesso, e o sucesso com um status de logado ou não}
     */
    logar: async(email: string, senha: string): Promise<{usuario?:any, sucesso:boolean}> => {
        if (email == 'teste@teste.com' && senha == '123456') 
            return {sucesso: true, usuario: { nome: 'Carlos', email }}
        
        return { sucesso: false }
    },

    /**
     * Função para recupera rsenha
     * @param email 
     * @returns sucesso status booleano caso tenha conseguido solicitar nova senha
     */
    recuperarSenha: async (email: string): Promise<{sucesso: boolean}> => {
        if (email == 'teste@teste.com') 
            return {sucesso: true }
        
        return { sucesso: false }
    },

    /**
     * Retorna a lista de usuários do sistema
     * @returns 
     */
    buscarUsuarios: async (): Promise<any[]> => {
        return [
            { id: 1, nome: 'Carlos', email: 'carlos@teste.com', admin: true },
            { id: 2, nome: 'Teste', email: 'teste@teste.com', admin: true },
            { id: 3, nome: 'Maria', email: 'maria@teste.com', admin: false },
            { id: 4, nome: 'Joao', email: 'joao@teste.com', admin: false },
        ]
    },

    /**
     * Retorna os dados de um usuário
     * @param id 
     * @returns 
     */
    buscar: async (id: number): Promise<any>  => {
        return { id: 1, nome: 'Carlos', email: 'carlos@teste.com', admin: true }
    },

    /**
     * Cadastra um novo usuário
     * @param usuario 
     * @returns 
     */
    cadastrar: async (usuario:any): Promise<{sucesso: boolean}> => {
        return {sucesso: true}
    },
    
    /**
     * Edita usuário
     * @param usuario 
     * @returns 
     */
    editar: async (usuario:any): Promise<{sucesso: boolean}> => {
        return {sucesso: true}
    }


}


export const useUsuarioService = () => UsuarioService;