import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from '.';

@Entity()   // @Entity( {name: 'productos_de_tesla' } )  Asi podria asignarle una nombre a la tabla por si no quiero que la tabla tomo automatico el de la entidad.
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    // text es el tipo de dato que le estoy asignando en la base de Postgres,
    unique: true,
    nullable: true,
  })
  title: string;

  // Esta sintaxis es lo mismo que la de arriba
  // @Column({
  //     type:'text,
  //     unique:true,
  //     nullable: true
  // })
  // title:string;

  @Column('float', {
    default: 0,
    nullable: true,
  })
  price: number;

  @Column('text', {
    nullable: true,
  })
  description: string;

  @Column('text', {
    unique: true,
  })
  slug: string; // Un slug es una versión de un título o nombre convertida en una cadena de texto optimizada para URL

  @Column('int', {
    default: 0,
  })
  stock: number;

  @Column('text', {
    array: true,
  })
  sizes: string[];

  @Column('text')
  gender: string;

  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product, { // @OneToMany: indica la relacion uno a muchos contra la tabla productImage, y crea automatico la fila productId.
    cascade: true,  // Elimina las imagenes que estan asocioadas al producto
    eager: true,    // Esto hace que el si se hace un busqueda con quearyer metodo find* lo retorne con su relacion si tiene.
  })
  images?: ProductImage[];

  @BeforeInsert() // @BeforeInsert: Se ejecuta antes de insertar un dato en la db
  checkSlugInsert() {
    if (!this.slug) {
      // Si el slug no viene lo igualo al titulo y le saco carateres especiales. this hace referencia al slug de este scope.
      this.slug = this.title;
    }
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate() // @BeforeUpdate: Se ejecuta antes de actualizar un dato en la db
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
