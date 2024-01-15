'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'

interface EditPageProps {
  params: {
    slug: string;
  };
}

interface Barang {
  id: number;
  attributes: {
    NamaBarang: string;
    JenisBarang: string;
    StokBarang: number;
    HargaBarang: number;
    Supplyer: string;
  };
}

const EditPage = ({ params }: EditPageProps) => {
  const router = useRouter()
  const id = params.slug
  const [formData, setFormData] = useState({
    NamaBarang: "",
    JenisBarang: "",
    StokBarang: 0,
    HargaBarang: 0,
    Supplyer:""
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const response = await axios.get(`http://localhost:1337/api/barangs/${id}`);
          const mahasiswaData = response.data.data as Barang;
          setFormData({
            NamaBarang: mahasiswaData.attributes.NamaBarang,
            JenisBarang: mahasiswaData.attributes.JenisBarang,
            StokBarang: mahasiswaData.attributes.StokBarang,
            HargaBarang: mahasiswaData.attributes.HargaBarang,
            Supplyer: mahasiswaData.attributes.Supplyer,
          });
        }
      } catch (error) {
        console.error('Error fetching Barang:', error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:1337/api/barangs/${id}`, {
        data: formData,
      });
      // Redirect to the Mahasiswa list page after successful submission
      router.push('/');
    } catch (error) {
      console.error('Error updating Barang:', error);
    }
  };

  return (
    <div className='wraper-form'>
          <form className='form'  style={{width:'80%'}}>
            <label>
              Nama Barang:
              <input
                type="text"
                name="NamaBarang"
                value={formData.NamaBarang}
                onChange={handleChange}
              />
            </label>
            <label>
              Jenis Barang:
              <input
                type="text"
                name="JenisBarang"
                value={formData.JenisBarang}
                onChange={handleChange}
              />
            </label>
            <label>
              Stok Barang:
              <input
                type="number"
                name="StokBarang"
                value={formData.StokBarang}
                onChange={handleChange}
              />
            </label>
            <label>
              Harga Barang:
              <input
                type="number"
                name="HargaBarang"
                value={formData.HargaBarang}
                onChange={handleChange}
              />
            </label>
            <label>
              Supplyer Barang:
              <input
                type="text"
                name="Supplyer"
                value={formData.Supplyer}
                onChange={handleChange}
              />
            </label>
            <div className='btn-wraper'>
            <button className="btn btn-green" type="button" onClick={handleSubmit}>
              Simpan
            </button>
            <button className="btn btn-red" type="button" onClick={handleSubmit}>
              Batal
            </button>
            </div>
          </form>
    </div>
  );
};

export default EditPage;
