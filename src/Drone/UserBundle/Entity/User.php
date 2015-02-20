<?php
// src/Acme/UserBundle/Entity/User.php

namespace Drone\UserBundle\Entity;

use FOS\UserBundle\Model\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Drone\MapBundle\Entity\Map as Map;

/**
 * @ORM\Entity
 * @ORM\Table(name="fos_user")
 */
class User extends BaseUser
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\OneToMany(targetEntity="Drone\MapBundle\Entity\Map", mappedBy="user")
     **/
    private $maps;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255, nullable=false)
     */
    private $address;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=10, nullable=false)
     */
    private $zipcode;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=10, nullable=false)
     */
    private $country;

    public function __construct()
    {
        parent::__construct();
        $this->maps = new ArrayCollection();
    }

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Add maps
     *
     * @param \Drone\UserBundle\Entity\Map $maps
     * @return User
     */
    public function addMap(\Drone\UserBundle\Entity\Map $maps)
    {
        $this->maps[] = $maps;

        return $this;
    }

    /**
     * Remove maps
     *
     * @param \Drone\UserBundle\Entity\Map $maps
     */
    public function removeMap(\Drone\UserBundle\Entity\Map $maps)
    {
        $this->maps->removeElement($maps);
    }

    /**
     * Get maps
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getMaps()
    {
        return $this->maps;
    }
}
