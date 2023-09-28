# Swift Task


## Features

- User Authentication and authorization
- Only user authorized as Admins are able to create/update/delete parking spots
- Users can create/update/delete cars in their profiles
- Reserve parking and charge the user with required amount, with possibility to cancel reservation
- I added DB queries directly instead of using sequelize framework for ORM, that`s why local DB instance needs to be configured

Missing components that I know are needed but did not manage to finalize due to time constraint:
- Run DB in container and write Dockerfile so that the whole application can be launched inside the docker container.
- Unit tests
- Add sequelize framework for ORM, in order to enable DB migrations


# Launch

For testing purposes you will have to create mysql database and configure the application accordingly
in .env file.
The script for creating neccessary tables is included in the root directory - create_tables.sql
