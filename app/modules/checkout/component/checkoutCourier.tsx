import { Box, Input, Select, Text } from '@chakra-ui/react';

import { useEffect, useState } from 'react';

const dataCourier = [
  'gojek',
  'grab',
  'deliveree',
  'jne',
  'tiki',
  'ninja',
  'lion',
  'sicepat',
  'rara',
  'jnt',
  'idexpress',
  'rpx',
  'jdl',
  'wahana',
  'pos',
  'anteraja',
  'sap',
  'paxel',
  'mrspeedy',
  'borzo',
  'lalamove',
];

interface CourierService {
  available_for_cash_on_delivery: true;
  available_for_proof_of_delivery: false;
  available_for_instant_waybill_id: true;
  available_for_insurance: true;
  company: string;
  courier_name: string;
  courier_code: string;
  courier_service_name: string;
  courier_service_code: string;
  description: string;
  duration: string;
  shipment_duration_range: string;
  shipment_duration_unit: string;
  service_type: string;
  shipping_type: string;
  price: number;
  type: string;
}

export default function CheckoutCourier() {
  const [postalCode, setPostalCode] = useState();
  // const [courier, setCourier] = useState("");
  const [rates, setRates] = useState('');
  const [courierService, setCourierService] = useState<CourierService[]>([]);

  const [dataRates, setDataRates] = useState({
    postalCode: '',
  });

  console.log(setPostalCode);

  const handleChangeCourier = async (e: any) => {
    const requestBody = {
      origin_postal_code: 12740,
      destination_postal_code: parseInt(dataRates.postalCode),
      couriers: e,
      items: [
        {
          name: 'Shoes',
          description: 'Black colored size 45',
          value: 199000,
          length: 10,
          width: 10,
          height: 10,
          weight: 200,
          quantity: 2,
        },
      ],
    };

    try {
      const response = await fetch(
        'https://api.biteship.com/v1/rates/couriers',
        {
          method: 'POST',
          headers: {
            authorization:
              'biteship_test.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYml0ZXNoaXAiLCJ1c2VySWQiOiI2NGY5OGJlN2EyNTA0MDQ1YzQ1MjE5NWIiLCJpYXQiOjE2OTQyNDk2NjN9.5RjX5-q_h2ipwLi0Us5Mhj6tlm-GGVxWNtoZLan06Ro',
            'content-type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setCourierService(data.pricing);
      console.log(data.pricing);
    } catch (error) {
      console.error('Error calculating shipping cost:', error);
    }
  };

  interface Provinsi {
    id: string;
    name: string;
  }

  interface Kabupaten {
    id: string;
    name: string;
  }
  interface Kecmatan {
    id: string;
    name: string;
  }

  // Deklarasikan state untuk menyimpan data provinsi
  const [provinsiOption, setProvinsiOption] = useState<Provinsi[]>([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedProvinceName, setSelectedProvinceName] = useState('');

  const [kabupatenOption, setKabupatenOption] = useState<Kabupaten[]>([]);
  const [selectedKabupaten, setSelectedKabupaten] = useState('');
  const [selectedKabupatenName, setSelectedKabupatenName] = useState('');

  const [kecamatanOption, setKecamatanOption] = useState<Kecmatan[]>([]);
  const [selectedKecamatan, setSelectedKecamatan] = useState('');
  const [selectedKecamatanName, setSelectedKecamatanName] = useState('');

  console.log({
    selectedProvinceName,
    selectedKabupatenName,
    selectedKecamatanName,
  });

  const fetchProvinsiData = async () => {
    try {
      const response = await fetch(
        'https://api.binderbyte.com/wilayah/provinsi?api_key=0ddfc24514a47d4cf2fbed43a7d4b151ec2944fceb30f8586d94e4501d29a5cd'
      );
      console.log('data PRovinsi : ', response);
      const data = await response.json();
      if (data.code === '200') {
        setProvinsiOption(data.value);
      }
    } catch (error) {
      console.error('Error fetching provinsi data:', error);
    }
  };

  const fetchKabupatenData = async () => {
    try {
      const id = selectedProvince.split(',')[0];
      const name = selectedProvince.split(',')[1];
      setSelectedProvinceName(name);
      console.log('Name Provinsi : ', name);
      const response = await fetch(
        `https://api.binderbyte.com/wilayah/kabupaten?api_key=0ddfc24514a47d4cf2fbed43a7d4b151ec2944fceb30f8586d94e4501d29a5cd&id_provinsi=${id}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log('data Kabupaten: ', data);
        setKabupatenOption(data.value);
      }
    } catch (error) {
      console.error('Error fetching kabupaten data:', error);
    }
  };

  const fetchKecamatanData = async () => {
    try {
      const id = selectedKabupaten.split(',')[0];
      const name = selectedKabupaten.split(',')[1];
      setSelectedKabupatenName(name);
      console.log('Name Kabupaten : ', name);
      const response = await fetch(
        `https://api.binderbyte.com/wilayah/kecamatan?api_key=0ddfc24514a47d4cf2fbed43a7d4b151ec2944fceb30f8586d94e4501d29a5cd&id_kabupaten=${id}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log('data Kecamatan : ', data);

        setKecamatanOption(data.value);
      }
    } catch (error) {
      console.error('Error fetching kecamatan data:', error);
    }
  };
  console.log('kecamatan name :', selectedKecamatanName);

  useEffect(() => {
    fetchProvinsiData();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      fetchKabupatenData();
    } else {
      setKabupatenOption([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedKabupaten) {
      fetchKecamatanData();
    } else {
      setKecamatanOption([]);
    }
  }, [selectedKabupaten]);

  // const handlePostalCodeChange = (event: any) => {
  //   setPostalCode(event.target.value);
  // };

  const handleRatesChange = (event: any) => {
    setRates(event.target.value);
  };

  const handleKabupatenChange = (event: any) => {
    setSelectedKabupaten(event.target.value);
  };

  const handleKecamatanChange = (event: any) => {
    setSelectedKecamatan(event.target.value);
    setSelectedKecamatanName(event.target.value.split(',')[1]);
  };

  return (
    <>
      <Box>
        <Box display={'flex'} flexDirection={'column'} gap={3}>
          <Select
            bgColor={'#fcfcfc'}
            name="province"
            placeholder="Pilih Provinsi"
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
          >
            {provinsiOption.map((option) => (
              <option key={option.id} value={option.id + ',' + option.name}>
                {option.name}
              </option>
            ))}
          </Select>

          <Select
            bgColor={'#fcfcfc'}
            name="district"
            placeholder="Pilih Kabupaten"
            value={selectedKabupaten}
            onChange={handleKabupatenChange}
          >
            {kabupatenOption.map((kabupaten) => (
              <option
                key={kabupaten.id}
                value={kabupaten.id + ',' + kabupaten.name}
              >
                {kabupaten.name}
              </option>
            ))}
          </Select>

          <Select
            bgColor={'#fcfcfc'}
            name="village"
            placeholder="Pilih Kecamatan"
            value={selectedKecamatan}
            onChange={handleKecamatanChange}
          >
            {kecamatanOption.map((kecamatan) => (
              <option
                key={kecamatan.id}
                value={kecamatan.id + ',' + kecamatan.name}
              >
                {kecamatan.name}
              </option>
            ))}
          </Select>

          <Input
            bgColor={'#fcfcfc'}
            name="postalCode"
            placeholder="Kode Pos"
            value={postalCode}
            onChange={(e) =>
              setDataRates({
                ...dataRates,
                postalCode: e.target.value,
              })
            }
          />
          <Box>
            <Text fontWeight={'bold'}>Pengiriman</Text>
          </Box>
          <Box display={'flex'} gap={3}>
            <Box width={'50%'}>
              <Select
                bgColor={'#fcfcfc'}
                name="courier"
                onChange={(e) => handleChangeCourier(e.target.value)}
              >
                <option hidden>Pilih Kurir</option>
                {dataCourier.map((data, index) => (
                  <option value={data} key={index}>
                    {data}
                  </option>
                ))}
              </Select>
            </Box>
            <Box width={'50%'}>
              <Select
                bgColor={'#fcfcfc'}
                name="courierService"
                onChange={(e) => {
                  handleRatesChange(e);
                }}
              >
                <option hidden>Pilih Tipe Pengiriman</option>
                {courierService.map((data, index) => (
                  <option value={data.price} key={index}>
                    {data.duration} {data.service_type} {data.price}
                  </option>
                ))}
              </Select>
            </Box>
          </Box>

          <Text>Harga Ongkir : {rates} </Text>
          {/* <Input
            hidden
            name="selectedProvinceName"
            placeholder="Phone Number"
            value={selectedProvinceName}
          />
          <Input
            hidden
            name="selectedKabupatenName"
            placeholder="Phone Number"
            value={selectedKabupatenName}
          />
          <Input
            hidden
            name="selectedKecamatanName"
            placeholder="Phone Number"
            value={selectedKecamatanName}
          /> */}
        </Box>
      </Box>
    </>
  );
}
