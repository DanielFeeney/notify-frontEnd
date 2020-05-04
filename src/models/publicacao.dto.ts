import { TagDTO } from './tag.dto';

export interface PublicacaoDTO{
    id: string;
    titulo: string;
    subTitulo: string;
    descricao: string;
    imagem: string;
    dataCriacao: Date;
    cpfUsuario: string;
    colTag: TagDTO[]
}