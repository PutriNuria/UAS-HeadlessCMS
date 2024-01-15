/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useState, useEffect } from "react";
import axios from 'axios';
import { useRouter } from 'next/navigation'
import Modal from "react-modal";

interface Barang {
  id: number;
  attributes: {
   NamaBarang: string;
    JenisBarang: string;
    StokBarang: number;
    HargaBarang: number;
    Supplyer:string;
  };
}

async function getData(): Promise<Barang[]> {
  try {
    const response = await axios.get('http://localhost:1337/api/barangs');
    return response.data.data as Barang[];
  } catch (error) {
    throw new Error("Gagal Mendapat Data");
  }
}

export default function Home() {
  const router = useRouter()
  const [data, setData] = useState<Barang[]>([]);
  const [selectedProduk, setSelectedProduk] = useState<Barang | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [newProduk, setNewProduk] = useState({
    NamaBarang: "",
    JenisBarang: "",
    StokBarang: 0,
    HargaBarang: 0,
    Suplyer:""
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedData = await getData();
        setData(fetchedData || []);
        console.log(data)
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchData();
  }, []);

  const handleShow = (produk: Barang) => {
    setSelectedProduk(produk);
    setModalIsOpen(true);
  };
  const handleCreate = () => {
    setAddModalIsOpen(true)
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduk((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:1337/api/barangs', {
        data: newProduk
      });
      window.location.reload();
    } catch (error) {
      console.error('Error adding Produk:', error);
    }
  };
  

  const handleDelete = async (produk: Barang) => {
    const userConfirmed = window.confirm(`Deleting Produk: ${produk.attributes.NamaBarang} - ${produk.attributes.JenisBarang}`);
    if (userConfirmed) {
    try {
      // Implement your delete logic here
      await axios.delete(`http://localhost:1337/api/barangs/${produk.id}`);
      // Fetch updated data after deletion
      const updatedData = await getData();
      setData(updatedData || []);
    } catch (error) {
      console.error('Error deleting Produk:', error);
    }
  } else{
    window.location.reload();
  }
};


  const closeModal = () => {
    setSelectedProduk(null);
    setModalIsOpen(false);
  };

  return (
    <>
      <h1 style={{ color: "blue" }}>Tabel Data Produk</h1>
      <div className="form">
      <table className="table">
            
            
            <thead>
          <tr>
            <th>NO</th>
            <th>Nama Barang</th>
            <th>Jenis Barang</th>
          </tr>
        </thead>
        
        <tbody>
        {data.map((barang) => (
          <tr key={barang.id}>
          <td>{barang.id}</td>
          <td>{barang.attributes.NamaBarang}</td>
          <td>{barang.attributes.JenisBarang}</td>
          <td>
              <button className="btn btn-blue" onClick={() => handleShow(barang)}>Detail</button>
              <button className="btn btn-yellow" onClick={() => router.push(`/page/edit/${barang.id}`)}>Edit</button>
              <button className="btn btn-red" onClick={() => handleDelete(barang)}>Hapus</button>
            </td>
          </tr>
                ))}
        </tbody>
      </table>
      <button className="btn btn-green" onClick={() => handleCreate()}>Tambah</button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Detail Barang">

        {selectedProduk && (
        <div>
            <h2>Detail Barang</h2>
            <p>Nama Barang: {selectedProduk.attributes.NamaBarang}</p>
            <p>Jenis Barang: {selectedProduk.attributes.JenisBarang}</p>
            <p>Stok Barang: {selectedProduk.attributes.StokBarang}</p>
            <p>Harga Barang: {selectedProduk.attributes.HargaBarang}</p>
            <p>Supplyer: {selectedProduk.attributes.Supplyer}</p>
            <button className="btn btn-red" onClick={closeModal}>Tutup</button>
        </div>
        )}
      </Modal>

      <Modal
        isOpen={addModalIsOpen}
        onRequestClose={() => setAddModalIsOpen(false)}
        contentLabel="Form Tambah Barang">
        <div>
            <h2>Tambah Barang atau Produk</h2>
            <form className="form">
              <label>
                Nama Barang:
                <input type="text" name="NamaBarang" onChange={handleInputChange} />
              </label>

              <label>
                Jenis Barang:
                <input type="text" name="JenisBarang" onChange={handleInputChange} />
              </label>

              <label>
                Stok Barang:
                <input type="text" name="StokBarang" onChange={handleInputChange} />
              </label>

              <label>
                Harga Barang:
                <input type="text" name="HargaBarang" onChange={handleInputChange} />
              </label>

              <label>
                Supplyer:
                <input type="text" name="Suplyer" onChange={handleInputChange} />
              </label>
              <div className="btn-wraper">
              <button type="button" className="btn btn-green" onClick={handleAddSubmit}>Simpan</button>
              <button type="button" className="btn btn-red" onClick={() => setAddModalIsOpen(false)}>Batal</button>
              </div>
            </form>
          </div>
      </Modal>

    </>
  );
}