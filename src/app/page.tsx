"use client";
import Image from "next/image";
import Header from "../components/Header";
import { bookmarkApi } from "./dummyApi/bookmarks";
import { useEffect, useState } from "react";
import axios from "axios";
export default function Home() {
  interface Bookmark {
    id: number;
    bname: string;
    imgurl: {
      src: string;
      width: number;
      height: number;
      alt: string;
      quality: number;
      layout: string;
      objectFit: string;
      priority: boolean;
    };
    color: string;
    url: string | string[];
  }
  const [reminder, setreminder] = useState(0);
  const [data, setData] = useState<Bookmark[]>([])

  useEffect(()=>{
    const storedData = localStorage.getItem('bookmarks');
    console.log(storedData)
  },[])
  function openUrlsInNewTabs(urls: any) {
    urls.forEach((url: string, index: number) => {
      setTimeout(() => {
        window.open(url, "_blank");
      }, index * 500);
    });
  }
  const [modalshow, setModalshow] = useState(false);
  const handleAddBookmark = () => {
    setModalshow(true);
  };

  const handleDel=(myid:number)=>{
    removeFromLocalStorage(myid);

    // Update state to remove the item with the specified id
    const updatedBookmarks = data.filter((bookmark) => bookmark.id !== myid);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    setData(updatedBookmarks)
  }

  


  const saveDataToLocalStorage = () => {
    try {
      // Convert array to JSON string
      const jsonData = JSON.stringify(data);
      
      // Store JSON string in localStorage with a key
      localStorage.setItem('bookmarks', jsonData);

      console.log('Data saved to localStorage.');
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  };

 

  const loadDataFromLocalStorage = () => {
    try {
      const storedData = localStorage.getItem('bookmarks');
      if (storedData) {
        setData(JSON.parse(storedData));
      } else {
        // If no data found in localStorage, initialize with default data
        setData(bookmarkApi);
      }
      console.log('Data loaded from localStorage:', data);
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  };
  

  // useEffect(()=>{
    
  //   loadDataFromLocalStorage()
  //   console.log("ami asi")
  // },[])

  const removeFromLocalStorage = (myid:number) => {
    try {
      // Get existing bookmarks from localStorage
      const existingBookmarks = localStorage.getItem('bookmarks');

      if (existingBookmarks) {
        // Parse existing bookmarks JSON
        const parsedBookmarks = JSON.parse(existingBookmarks);

        // Filter out the item with the specified id
        const updatedBookmarks = parsedBookmarks.filter((bookmark:any) => bookmark.id !== myid);

        // Update localStorage with updated bookmarks
        localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
        
        console.log(`Bookmark with id ${myid} removed from localStorage.`);
      }
    } catch (error) {
      console.error('Error removing bookmark from localStorage:', error);
    }
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [bname,setbname] = useState("")
  const [url,seturl] = useState("")

  const handleFileChange = (event:any) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.warn('No file selected.');
      return;
    }
    console.log('selectedFile:', selectedFile);
    console.log('bname:', bname);
    console.log('url:', url);
    
    // Create formData and append values
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('bname', bname);
    formData.append('url', url);
    
    // Log formData to check its contents
    for (var pair of formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]); 
  }
      try {
        const response = await axios.post('/api/uploadImage',formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Set content type to multipart/form-data for file upload
          },
        });
  
        if (response.status === 200) {
          const newData = response.data;
          console.log('Updated data:', newData);
          // Handle the updated data (e.g., update state, display new image)
        } else {
          console.error('File upload failed:', response.statusText);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    
  };



  return (
    <>
      <div className="main">
       
        {modalshow ? (
          <div className="modal opacity-1 duration-500 bg-gray-100 rounded-lg w-96 h-96  fixed top-5 left-1/2 -translate-x-1/2 z-40">
            <div onClick={()=>setModalshow(false)} className="close w-10 h-10 rounded-full overflow-hidden  top-3 right-3 absolute z-50">
                <Image onClick={()=>console.log("hello")}
                          
                          src="/assets/images/close.jpg"
                          width={50}
                          height={50}
                          alt="My Image"
                          quality={80}
                          layout="responsive"
                          objectFit="cover"
                          priority={true}/>
            </div>
            <div className="modalform mt-20 px-4">
            <input type="text" value={bname} onChange={(e)=>setbname(e.target.value)} placeholder="Site Name" className="pl-5 duration-1000 w-full h-[40px] border border-zinc-400 "/>
            <input type="file" onChange={handleFileChange} placeholder="Site Name" className="pl-5 mt-2 pt-1 bg-white duration-1000 w-full h-[40px] border border-zinc-400 "/>
            <input type="text" value={url} onChange={(e)=>seturl(e.target.value)} placeholder="Enter Url" className=" mt-2 pl-5 duration-1000 w-full h-[40px] border border-zinc-400 "/>
            <button onClick={handleUpload} className="w-full h-[40px] btn bg-blue-500 mt-2 text-slate-200">Submit</button>
            </div>
          </div>
        )
        :
        (
          <div className="modal invisible opacity-0 duration-500 rounded w-96 h-96  fixed z-40 top-5 left-1/2 -translate-x-1/2">
             
          </div>
        )
      }
        <Header />
        <div className="mycontainer">
          <div
            onClick={handleAddBookmark}
            className="topbutton cursor-pointer flex items-center justify-center ms-auto w-40 rounded-lg h-12 my-6"
          >
            <h3 className="font-serif">Add Bookmark</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {data?.map((item, key) => {
              return (
                <>
                  <div
                    
                    style={{ background: item.color }}
                    className="maincard rounded-lg p-5 shadow-lg cursor-pointer"
                  >
                    <div className="divwr ">
                      <div className="wrap flex items-center" onClick={() => openUrlsInNewTabs(item.url)}>
                      <Image src={item.imgurl} alt={item.bname} />
                      <h2 className="ml-3 font-semi-bold">{item.bname}</h2>

                      </div>
                      <div className="overlayicon hover:shadow-lg">
                        <Image
                          onClick={()=>handleDel(item.id)}
                          
                          src="/assets/images/del.png"
                          width={50}
                          height={50}
                          alt="My Image"
                          quality={80}
                          layout="responsive"
                          objectFit="cover"
                          priority={true}
                        />
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
