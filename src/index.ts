import api from '@/api';

const port: number = Number(process.env.PORT);

api.listen({ port, host: '0.0.0.0' }, function (error, address) {
  if (error) {
    api.log.error(error);
    return;
  }
  console.log(`Octo Events API running at ${address}`);
});
