import { app, port } from "@/app";

const start = () => {
  try {
    app.listen(port, () => {
      console.log(`Server started successfully on port ${port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
