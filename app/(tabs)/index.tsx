// ApartmentForm.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, Switch, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { insertApartment } from '../../ConDB/supabaseClient';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../ConDB/supabaseClient';
export default function ApartmentForm() {
  const [title, setTitle] = useState('');
  const [images, setImages] = useState([]);
  const [area, setArea] = useState('');
  const [offerType, setOfferType] = useState('');
  const [location, setLocation] = useState('');
  const [parking, setParking] = useState(false);
  const [swimmingPool, setSwimmingPool] = useState(false);
  const [paymentType, setPaymentType] = useState('');
  const [installmentDuration, setInstallmentDuration] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [livingRooms, setLivingRooms] = useState('');
  const [status, setStatus] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const addImage = async () => {
    // ... (permission check and image picking)

    const imageUri = result.uri;
    const imageName = `image_${Date.now()}.jpg`;

    const imageUrl = await uploadImage(imageUri, imageName);
    if (imageUrl) {
      setImages((prev) => [...prev, imageUrl]);
    }
  };

  const uploadImage = async (uri, name) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const { data, error } = await supabase.storage
      .from('images') // Replace 'images' with your bucket name
      .upload(name, blob, { contentType: 'image/jpeg' });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    return `${supabase.storage.from('images').getPublicUrl(data.Key).publicURL}`;

  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
    setPurchaseDate(currentDate.toISOString().split('T')[0]);
  };

  const handleSubmit = async () => {
    const imagesText = images.join(',');

    const apartmentData = {
      title,
      images: imagesText,
      area: parseFloat(area),
      offer_type: offerType,
      location,
      parking,
      swimming_pool: swimmingPool,
      payment_type: paymentType,
      installment_duration: paymentType === 'installments' ? parseInt(installmentDuration) : null,
      purchase_date: purchaseDate,
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      living_rooms: parseInt(livingRooms),
      status,
    };

    try {
      const data = await insertApartment(apartmentData);
      console.log('Data inserted:', data);
      setTitle('');
      setImages([]);
      setArea('');
      setOfferType('');
      setLocation('');
      setParking(false);
      setSwimmingPool(false);
      setPaymentType('');
      setInstallmentDuration('');
      setPurchaseDate('');
      setBedrooms('');
      setBathrooms('');
      setLivingRooms('');
      setStatus('');
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>Title:</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter title"
          style={styles.input}
        />

        <Text style={styles.label}>Images:</Text>
        <Button title="Add Image" onPress={addImage} />
        <View style={styles.imageContainer}>
          {images.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.image} />
          ))}
        </View>

        <Text style={styles.label}>Area (sqm):</Text>
        <TextInput
          value={area}
          onChangeText={setArea}
          placeholder="Enter area"
          style={styles.input}
        />

        <Text style={styles.label}>Offer Type:</Text>
        <View style={styles.offerTypeContainer}>
          <Button title="Rent" onPress={() => setOfferType('rent')} color={offerType === 'rent' ? 'blue' : 'grey'} />
          <Button title="Sale" onPress={() => setOfferType('sale')} color={offerType === 'sale' ? 'blue' : 'grey'} />
          <Button title="Investment" onPress={() => setOfferType('investment')} color={offerType === 'investment' ? 'blue' : 'grey'} />
        </View>

        <Text style={styles.label}>Location:</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Enter location"
          style={styles.input}
        />

        <Text style={styles.label}>Parking:</Text>
        <Switch value={parking} onValueChange={setParking} />

        <Text style={styles.label}>Swimming Pool:</Text>
        <Switch value={swimmingPool} onValueChange={setSwimmingPool} />

        <Text style={styles.label}>Payment Type:</Text>
        <View style={styles.paymentTypeContainer}>
          <Button title="Cash" onPress={() => setPaymentType('cash')} color={paymentType === 'cash' ? 'blue' : 'grey'} />
          <Button title="Installments" onPress={() => setPaymentType('installments')} color={paymentType === 'installments' ? 'blue' : 'grey'} />
        </View>

        {paymentType === 'installments' && (
          <>
            <Text style={styles.label}>Installment Duration (months):</Text>
            <TextInput
              value={installmentDuration}
              onChangeText={setInstallmentDuration}
              placeholder="Enter duration"
              style={styles.input}
            />
          </>
        )}

        <Text style={styles.label}>Purchase Date:</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.datePicker}>
            {purchaseDate || "Select Purchase Date"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <Text style={styles.label}>Bedrooms:</Text>
        <TextInput
          value={bedrooms}
          onChangeText={setBedrooms}
          placeholder="Enter number of bedrooms"
          style={styles.input}
        />

        <Text style={styles.label}>Bathrooms:</Text>
        <TextInput
          value={bathrooms}
          onChangeText={setBathrooms}
          placeholder="Enter number of bathrooms"
          style={styles.input}
        />

        <Text style={styles.label}>Living Rooms:</Text>
        <TextInput
          value={livingRooms}
          onChangeText={setLivingRooms}
          placeholder="Enter number of living rooms"
          style={styles.input}
        />

        <Text style={styles.label}>Property Status:</Text>
        <TextInput
          value={status}
          onChangeText={setStatus}
          placeholder="Enter property status"
          style={styles.input}
        />

        <Button title="Submit" onPress={handleSubmit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 5,
  },
  offerTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  paymentTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
});
