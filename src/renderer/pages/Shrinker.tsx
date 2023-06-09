import React, {
  FormEvent,
  DragEvent,
  useState,
  useEffect,
  useContext,
} from 'react';
import AppLayout from 'renderer/components/layouts/AppLayout';
import AppHeader from 'renderer/components/common/Header';
import AppButton from 'renderer/components/common/Button';
import AppFileDropZone from 'renderer/components/common/AppFileDropZone';
import CompressorContext from 'renderer/context/image-compresser-context';
import CompressorProvider from 'renderer/providers/image-compressor-provider';
import AppFileCollection from 'renderer/components/common/AppFileCollection';
import { Button, Modal, Tooltip, OverlayTrigger } from 'react-bootstrap';
import AppConvertToButton from 'renderer/components/common/AppConvertToButton';

const Shrinker = (): JSX.Element => {
  const [dragging, setDragging] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);

  const [fileToCompress, setFileToCompress] = useState<any[]>();
  const [fileToSendToCompressor, setFileToSendToCompressor] = useState<any>({});
  const [allFilesContainer, setAllFilesContainer] = useState<any>([]);
  const [contextValues, setContextValues] = useState<any>({});

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileUpload = (e: any) => {
    e.preventDefault();
    if (e.dataTransfer?.files) {
      const files = e.dataTransfer?.files;
      const fileArray = [...files];
      setFileToCompress(fileArray);
    } else {
      const files = e?.target.files || fileToCompress;
      const fileArray = [...files];
      setFileToCompress(fileArray);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    handleFileUpload(e);
  };

  const handleCompress = (e: any) => {
    const files: any = fileToCompress;
    const fileArray = [...files];
    const fileCompressionLevel = e.target.form[1].value;
    setFileToSendToCompressor({ fileArray, fileCompressionLevel });
    console.log('from the renderer file');
    console.log(fileArray, fileCompressionLevel);
  };

  const handleFileRemoval = (index: number, e: MouseEvent) => {
    fileToCompress?.splice(index, 1);
    handleFileUpload(e);
    console.log(fileToCompress);
    return e;
  };

  useEffect(() => {
    setAllFilesContainer(
      fileToCompress?.map((file: File, index: number) => {
        return (
          <AppFileCollection
            key={index}
            className="my-2"
            fileName={file.name}
            fileSize={file.size}
            onCancel={(e: MouseEvent) => handleFileRemoval(index, e)}
            conversionStatus={contextValues.status}
            compressionDetails={contextValues.compressionDetails[file.name]}
          />
        );
      })
    );
  }, [fileToCompress, contextValues]);

  const context = useContext(CompressorContext);

  useEffect(() => {
    if (context) {
      setContextValues(context);
    }
  }, [context]);

  return (
    <CompressorProvider
      apiArguments={fileToSendToCompressor && fileToSendToCompressor}
    >
      <AppLayout
        className="app-content-scroll app-content-flex flex-column"
        onShrinkerPage={true}
      >
        <CompressorContext.Consumer>
          {(context) => {
            context && setContextValues(context);
            return (
              <>
                <section className="convert-container d-flex align-items-start justify-content-start flex-column mx-4">
                  <AppHeader className="text-capitalize my-3">
                    Image size reducer
                  </AppHeader>
                  <p className="text-muted">Reduce an image size</p>
                </section>

                <form
                  className="upload-button-section width-toggle-3 d-flex align-items-center m-auto flex-column"
                  encType="multipart/form-data"
                  id="conversion_form"
                  onChange={(e: FormEvent) => handleFileUpload(e)}
                  onSubmit={(e: FormEvent) => handleCompress(e)}
                >
                  <AppFileDropZone
                    handleDragEnter={handleDragEnter}
                    handleDragLeave={handleDragLeave}
                    handleDragOver={handleDragOver}
                    handleDrop={handleDrop}
                  />

                  {fileToCompress && (
                    <section className="app-convert-to-container d-flex align-items-start w-100 my-3 flex-column">
                      <p className="text-muted brand-small-text-2 text-capitalize my-2 ">
                        compression level
                      </p>

                      <AppConvertToButton
                        className="convert-to-width-2"
                        values={[
                          'High Compression',
                          'Higher Compression',
                          'Highest Compression',
                        ]}
                      />
                    </section>
                  )}
                  <section className="spacer my-3"></section>
                  <React.Fragment>
                    {fileToCompress && allFilesContainer}
                  </React.Fragment>
                  {fileToCompress && (
                    <section className="submit-button-container w-100 d-flex align-items-start my-5">
                      <AppButton
                        className="width-toggle brand-small-text text-capitalize"
                        onClick={handleCompress}
                      >
                        Compress Image
                      </AppButton>
                    </section>
                  )}

                  <section className="compression-details"></section>
                </form>
              </>
            );
          }}
        </CompressorContext.Consumer>
      </AppLayout>
    </CompressorProvider>
  );
};

export default Shrinker;
