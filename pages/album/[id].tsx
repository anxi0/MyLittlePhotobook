import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import type { Photo, Album } from "../../libs/types";
import styles from "../../styles/Album.module.css";

const Album = ({ albumPhotos }: { albumPhotos: Photo[] }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo>({
    albumId: 0,
    id: 0,
    title: "",
    url: "",
    thumbnailUrl: "",
  });
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Album Photos</h1>
      <div className={styles.photoGrid}>
        {albumPhotos.map((albumPhoto: Photo) => (
          <div
            key={albumPhoto.id}
            className={styles.photo}
            onClick={() => {
              setIsModalOpen(true);
              setSelectedPhoto(
                albumPhotos.filter((album) => album.id === albumPhoto.id)[0]
              );
            }}
          >
            <Image
              src={albumPhoto.thumbnailUrl}
              width={150}
              height={150}
              layout="fixed"
            />
            {`${albumPhoto.id}. ${albumPhoto.title}`}
          </div>
        ))}
      </div>
      {isModalOpen && (
        <>
          <div
            style={{
              position: "fixed",
              backgroundColor: "black",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              opacity: 0.5,
            }}
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div
            style={{
              position: "fixed",
              top: "20%",
              left: "30%",
              backgroundColor: "white",
              width: "40%",
              height: "60%",
              display: "flex",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                width: "100%",
                height: "100%",
                flexDirection: "column",
              }}
            >
              <Image
                src={selectedPhoto.url}
                width={600}
                height={600}
                layout="fixed"
              />
              {selectedPhoto.title}
            </div>
            <div
              className={styles.Xbutton}
              onClick={() => setIsModalOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const { id } = context.params;
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/albums/${id}/photos`
  );
  const albumPhotos = await res.json();
  return {
    props: {
      albumPhotos,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/albums");
  let albums = await res.json();
  const paths = albums.map((album: Album) => ({
    params: {
      id: album.id.toString(),
    },
  }));
  return {
    paths,
    fallback: false,
  };
};

export default Album;
