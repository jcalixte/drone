Bee Eye
========================

Bienvenue sur la plateforme _Bee Eye_, un site internet construit avec le Framework [Symfony2][0]

Qu'y a-t-il dedans ?
--------------

L'édition standard de Symfony2 est configuré avec :

  * Twig comme langage pour template;
  * Doctrine ORM/DBAL;
  * Swiftmailer pour l'envoi de mail;
  * Annotations activées pour tout.

De plus, Symfony2 est configuré avec les bundles suivants :
* **FrameworkBundle** - Le coeur du Framework Symfony2
* [**SensioFrameworkExtraBundle**][6] - Adds several enhancements, including
    template and routing annotation capability
* [**DoctrineBundle**][7] - Ajoute le support à Doctrine ORM
* [**TwigBundle**][8] - Ajoute le support de Twig
* [**SecurityBundle**][9] - Ajoute le support du composant de la sécurité Symfony2
* [**SwiftmailerBundle**][10] - Ajoute le support de Swiftmailer, une bibliothèque pour l'envoi de courriels.
* [**MonologBundle**][11] - Adds support for Monolog, a logging library
* [**AsseticBundle**][12] - Adds support for Assetic, an asset processing
    library
* **WebProfilerBundle** (in dev/test env) - Adds profiling functionality and
    the web debug toolbar
* **SensioDistributionBundle** (in dev/test env) - Adds functionality for
    configuring and working with Symfony distributions
* [**SensioGeneratorBundle**][13] (in dev/test env) - Adds code generation
    capabilities

Toutes les bibliothèques incluses dans l'édition Symfony sont publiées sous les licences MIT ou BSD.
All libraries and bundles included in the Symfony Standard Edition are
released under the MIT or BSD license.

La touche Bee Eye
--------------

La plateforme utilise pour sa part les bundles suivants :
* [FOSUserBundle][14] - The FOSUserBundle adds support for a database-backed user system in Symfony2. It provides a flexible framework for user management that aims to handle common tasks such as user registration and password retrieval.
* [FOSRESTBundle][15] - This bundle provides various tools to rapidly develop RESTful API's & applications with Symfony2. 
* [FOSJsRoutingBundle][16] - This bundle allows you to expose your routing in your JavaScript code. That means you'll be able to generate URL with given parameters like you can do with the Router component provided in the Symfony2 core.
* [NelmioApiDocBundle][17] - The NelmioApiDocBundle bundle allows you to generate a decent documentation for your APIs.
* [VichUploaderBundle][18] - The VichUploaderBundle is a Symfony2 bundle that attempts to ease file uploads that are attached to ORM entities, MongoDB ODM documents, PHPCR ODM documents or Propel models.
* [KnpGaufretteBundle][19] - Provides a [Gaufrette][27] integration for your Symfony projects.
* [JMSSerializerBundle][20] - This bundle integrates the serializer library into Symfony2.
* [EndroidQrCodeBundle][21] - This bundle provides a default controller for generating QR codes using the QR Code (endroid/QrCode) library.
* [SonataCoreBundle][22] - The SonataCoreBundle provided defaults elements required by the different Sonata’s Bundles.
* [SonataBlockBundle][23] - The SonataBlockBundle provided defaults elements required by the different Sonata’s Bundles.
* [KnpMenuBundle][24] - The KnpMenuBundle integrates the KnpMenu PHP library with Symfony2. This means easy-to-implement and feature-rich menus in your Symfony2 application!
* [SonataDoctrineORMAdminBundle][25] - This bundle integrates the SonataAdminBundle with the Doctrine ORM project.
* [SonataAdminBundle][26] - A set of bundles connected to the most known “Admin Bundle” that provides robust administration interfaces. 

Et enfin, Bee Eye comporte ses propres bundles spécifiques :
* DroneUserBundle - Hérite du FosUserBundle et permet de l'implémenter sur la plateforme
* DroneMapBundle - Ajoute les fonctionnalités des cartographies et la communication avec les drones
* DroneAdminBundle - Hérite de SonataAdminBundle et permet de l'implémenter sur la plateforme 
* DroneHomeBundle - comprend toutes les pages statiques du site

Au plaisir de monter à bord !

Installation
============

Pour installer Bee Eye sur votre ordinateur, exécutez les commandes suivantes :

```git
git clone https://github.com/jcalixte/drone.git
cd votre_projet/
php composer.phar self-update
php composer.phar install
php app/console assets:install
php app/console cache:clear
```

Ajoutez un fichier paramètre s'il n'existe pas et modifiez-le selon vos besoins :

```yml
# votre_projet/app/config/parameters.yml
parameters:
    database_driver: pdo_mysql
    database_host: 127.0.0.1
    database_port: null
    database_name: drone
    database_user: root
    database_password: null
    mailer_transport: smtp
    mailer_host: localhost
    mailer_user: null
    mailer_password: null
    locale: fr
    secret: ThisTokenIsNotSoSecretChangeIt
```

Créez votre base de données et mettez à jour son organisation _(veillez à avoir votre serveur allumé)_ :

```git
php app/console doctrine:database:create
php app/console doctrine:schema:update --force
```

Vous pouvez désormais consulter la plateforme à l'adresse suivante : **localhost/votre_projet/web/app_dev.php/**

[Consulter la logique de la plateforme pour les drones][28].

[0]:  https://symfony.com/
[1]:  http://symfony.com/doc/2.6/book/installation.html
[6]:  http://symfony.com/doc/2.6/bundles/SensioFrameworkExtraBundle/index.html
[7]:  http://symfony.com/doc/2.6/book/doctrine.html
[8]:  http://symfony.com/doc/2.6/book/templating.html
[9]:  http://symfony.com/doc/2.6/book/security.html
[10]: http://symfony.com/doc/2.6/cookbook/email.html
[11]: http://symfony.com/doc/2.6/cookbook/logging/monolog.html
[12]: http://symfony.com/doc/2.6/cookbook/assetic/asset_management.html
[13]: http://symfony.com/doc/2.6/bundles/SensioGeneratorBundle/index.html
[14]: https://github.com/FriendsOfSymfony/FOSUserBundle
[15]: https://github.com/FriendsOfSymfony/FOSRestBundle
[16]: https://github.com/FriendsOfSymfony/FOSJsRoutingBundle
[17]: https://github.com/nelmio/NelmioApiDocBundle
[18]: https://github.com/dustin10/VichUploaderBundle
[19]: https://github.com/KnpLabs/KnpGaufretteBundle
[20]: https://github.com/schmittjoh/JMSSerializerBundle
[21]: https://github.com/endroid/EndroidQrCodeBundle
[22]: https://github.com/sonata-project/SonataCoreBundle
[23]: https://github.com/sonata-project/SonataBlockBundle
[24]: https://github.com/KnpLabs/KnpMenuBundle
[25]: https://github.com/sonata-project/SonataDoctrineORMAdminBundle
[26]: https://github.com/sonata-project/SonataAdminBundle
[27]: https://github.com/KnpLabs/Gaufrette
[28]: /web/javascript/