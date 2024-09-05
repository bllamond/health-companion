import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from 'react-toastify';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function Profile() {
  const [name, setName] = useState("");
  const [age, setAge] = useState();
  const [weight, setWeight] = useState();
  const [height, setHeight] = useState();
  const [gender, setGender] = useState();
  const [uid, setUid] = useState(null);
  const [chronicDiseases, setChronicDiseases] = useState([]);
  const [docExists, setDocExists] = useState(false);
  const [allergyInput, setAllergyInput] = useState("");
  const [allergies, setAllergies] = useState([]);
  
  const handleAddChronicDisease = async (disease) => {
    let updatedChronicDiseases;

    if (chronicDiseases.includes(disease)) {
      updatedChronicDiseases = chronicDiseases.filter(
        (item) => item !== disease
      );
    } else {
      updatedChronicDiseases = [...chronicDiseases, disease];
    }

    setChronicDiseases(updatedChronicDiseases);

    try {
      const userDocRef = doc(db, "ProfileData", uid);
      const userDoc = await getDoc(userDocRef);

      console.log('updated')
      const data = {
          ChronicDiseases: updatedChronicDiseases,
      };

      if (userDoc.exists()) {
        await setDoc(userDocRef, data, { merge: true });
        toast.success("Details updated successfully!");
    } else {
        await setDoc(userDocRef, data);
        toast.success("Details submitted successfully!");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while submitting your details.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        checkUserDoc(user.uid);
        fetchUserDetails(user.uid);
      } else {
        setUid(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    
    if(!uid)
    {
        toast.error("You must be logged in to submit details");
        return;

    }
    
    try {
      const userDocRef = doc(db, "ProfileData", uid);
      const userDoc = await getDoc(userDocRef);
      const data = {
        Name: name,
        Gender: gender,
        Height: height,
        Weight: weight,
        Age: age,
      };
      if (userDoc.exists()) {
        await setDoc(userDocRef, data, { merge: true }); // Merge updates existing fields without overwriting the entire document
        toast.success("Details updated successfully!");
      } else {
        await setDoc(userDocRef, data);
        toast.success("Details submitted successfully!");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while submitting your details.");
    }
  };
    
  const checkUserDoc = async (userId) => {
    const userDocRef = doc(db, "ProfileData", userId);
    const userDoc = await getDoc(userDocRef);
    setDocExists(userDoc.exists());
};

const fetchUserDetails = async (userId) => {
    try {
        const userDocRef = doc(db, "ProfileData", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const data = userDoc.data();
            setName(data.Name);
            setGender(data.Gender);
            setHeight(data.Height);
            setWeight(data.Weight);
            setAge(data.Age);
            setAllergies(data.Allergies || []);
            setChronicDiseases(data.ChronicDiseases || []);
            setDocExists(true);
        }
    } catch (error) {
        console.log(error);
        toast.error("An error occurred while fetching your details.");
    }
};
  
  const handleAddAllergy = async () => {
    if (allergyInput.trim()) {
      const updatedAllergies = [...allergies, allergyInput.trim()]; // Create the updated list here
      setAllergies(updatedAllergies);
      setAllergyInput("");

      try {
        const userDocRef = doc(db, "ProfileData", uid);
        const userDoc = await getDoc(userDocRef);

        const data = {
          Allergies: updatedAllergies, // Use the updated list here
        };

        if (userDoc.exists()) {
          await setDoc(userDocRef, data, { merge: true }); // Merge updates existing fields without overwriting the entire document
          toast.success("Details updated successfully!");
        } else {
          await setDoc(userDocRef, data);
          toast.success("Details submitted successfully!");
        }
      } catch (error) {
        console.log(error);
        toast.error("An error occurred while submitting your details.");
      }
    }
  };
  return (
    <div>
      <div className="pt-[5vh] font-semibold text-3xl text-[#]">
        Profile Details
      </div>
      <div className="font-medium flex flex-col gap-2 mt-[5vh]  border px-[40vh] rounded-sm  py-[5vh] ">
        <div className="flex gap-4">
          <label className="w-20">Name: </label>
          <input
            placeholder={name ? name : "name"}
            className="border"
            aria-label="name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <label className="w-20">Age: </label>
          <input
            placeholder={name ? age : "age"}
            className="border"
            aria-label="name"
            onChange={(e) => setAge(Number(e.target.value))}
          />
        </div>
        <div className="flex gap-4">
          <label className="w-20">Weight: </label>
          <input
            placeholder={weight ? weight : "weight"}
            className="border"
            aria-label="name"
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <label className="w-20">Height: </label>
          <input
            placeholder={height ? height : "height"}
            className="border"
            aria-label="name"
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <label className="w-20">Gender: </label>
          <input
            placeholder={gender ? gender : "gender"}
            className="border"
            aria-label="name"
            onChange={(e) => setGender(e.target.value)}
          />
        </div>
        <button className="bg-black text-white mt-[5vh] w-[37vh] rounded-sm p-2 " onClick={handleSubmit}>{docExists ? "Update Details" : "Submit Details"}</button>
      </div>

      <div className="flex justify-content pt-[5vh] text-3xl gap-4 font-bold">
        <div className="">Chronic Diseases</div>

        <div className="flex flex-col gap-1">
          <ul
            className="py-2 text-sm flex"
            aria-labelledby="dropdownDefaultButton"
          >
            <li className="px-4 py-2  hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={chronicDiseases.includes("Diabetes")}
                  onChange={() => handleAddChronicDisease("Diabetes")}
                />
                <span className="ml-2">Diabetes</span>
              </label>
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={chronicDiseases.includes("Heart Disease")}
                  onChange={() => handleAddChronicDisease("Heart Disease")}
                />
                <span className="ml-2">Heart Disease</span>
              </label>
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={chronicDiseases.includes("Hypertension")}
                  onChange={() => handleAddChronicDisease("Hypertension")}
                />
                <span className="ml-2">Hypertension</span>
              </label>
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={chronicDiseases.includes("Obesity")}
                  onChange={() => handleAddChronicDisease("Obesity")}
                />
                <span className="ml-2">Obesity</span>
              </label>
            </li>
          </ul>

          <div className="border border-gray-300 p-4 m-4">
            <ul className="flex space-x-8">
              {chronicDiseases.map((disease, index) => (
                <li key={index} className="text-lg">
                  {disease}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>


      <div className="flex items-center justify-content pt-[5vh] gap-4">
        <div className="text-3xl font-bold">Allergies</div>

        <div>
          <input
            placeholder="Enter Food Item"
            value={allergyInput}
            onChange={(e) => setAllergyInput(e.target.value)}
            aria-label=""
            className="bg-gray-100 px-2 rounded-lg border border-black"
          />
          <button onClick={handleAddAllergy} className="mx-2 font-semibold">
            Add
          </button>
        </div>
      </div>


      <div className="border border-gray-300 p-4 m-4">
        <ul>
          {allergies.map((allergy, index) => (
            <li key={index} className="text-lg">
              {allergy}
            </li>
          ))}
        </ul>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Profile;
